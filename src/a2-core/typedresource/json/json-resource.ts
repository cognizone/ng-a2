import {JsonResourceWrapper, MultiJsonResourceWrapper, SingleJsonResourceWrapper} from './json-resource-wrapper';
import {RdfDataType} from '../../rdf/rdf-data-type';
import {JsonResourceFactory} from './json-resource-factory';
import {Preconditions} from "../../../precondition/preconditions";

export const BasicJsonResourceFactory: JsonResourceFactory<JsonResource> = (rawJson, structure) => new JsonResource(rawJson, structure);

export class JsonResource {
  static _wrap(jsonRoot: any = { data: {} }): JsonResource {
    const structure = new SingleJsonResourceWrapper<JsonResource>(jsonRoot, BasicJsonResourceFactory);
    return structure.getRoot();
  }

  static _wrapMany(jsonRoot: any = { data: [] }): JsonResource[] {
    const structure = new MultiJsonResourceWrapper<JsonResource>(jsonRoot, BasicJsonResourceFactory);
    return structure.getRoots();
  }

  static _create(uri: string, type: string[]): JsonResource {
    return JsonResource._wrap({ data: { uri: uri, type: type } });
  }

  private _json: any;
  private _structure: JsonResourceWrapper<JsonResource>;

  constructor(json: any, structure: JsonResourceWrapper<JsonResource>) {
    Preconditions.checkNotNull(json, () => 'json was null');
    this._json = json;
    this._structure = structure;
  }

  getRawJson() {
    return this._json;
  }

  getUri(): string {
    return this._json.uri;
  }

  isEmptyResource(): boolean {
    return (
      Object.keys(this.__getAttributes()).length == 0 &&
      Object.keys(this.__getReferences()).length == 0
    );
  }

  setUri(uri: string): void {
    this._json['uri'] = uri;
  }

  setType(type: string) {
    this._json['type'] = type;
  }

  getType() {
    return this._json.type;
  }

  getValueWithDataType(attributeId: string, dataType?: RdfDataType) {
    const attrib = this.__getAttributes()[attributeId];
    if (!attrib) { return null; }
    return dataType ? attrib[dataType.shortened] : Object.values(attrib).pop();
  }

  setValueWithDataType(attributeId: string, value: any, dataType: RdfDataType) {
    if (!this._json.attributes) this._json['attributes'] = {};
    const obj = {};
    obj[dataType.shortened] = value;
    this.__getAttributes()[attributeId] = obj;
  }

  getLangString(key: string, lang: string): string {
    const attrib = this.getValueWithDataType(key, RdfDataType.TYPES.rdf_langString);
    return attrib ? attrib[lang] : null;
  }

  getLangStrings(key: string, lang: string): string[] {
    return <string[]>(<unknown>this.getLangString(key, lang));
  }

  getXsdString(key: string): string {
    return this.getValueWithDataType(key, RdfDataType.TYPES.xsd_string);
  }

  getXsdStrings(key: string): string[] {
    return <string[]>(<unknown>this.getXsdString(key));
  }

  getResources(attributeId: string): JsonResource[] {
    return this.getStructure().getChildrenByReference(attributeId, this);
  }

  getResource(attributeId: string): JsonResource {
    const children = this.getResources(attributeId);

    Preconditions.checkState(children.length <= 1);
    return children.length == 1 ? children[0] : null;
  }

  getParents(attributeId?: string) {
    return attributeId
      ? this._structure.getParentsByReference(attributeId, this)
      : this._structure.getParents(this);
  }

  getParent(attributeId: string) {
    return this._structure.getParentsByReference(attributeId, this).pop();
  }

  getReference(attribute: string): string {
    return this.__getReferences()[attribute];
  }

  getReferences(attribute: string): string[] {
    return this.__getReferences()[attribute];
  }

  clearValue(attributeId: string): void {
    delete this.__getAttributes()[attributeId];
    this.clearResources(attributeId);
  }

  clearResources(attribute: string) {
    const existing = this.getResources(attribute);
    existing.forEach(resource => this.clearResource(attribute, resource.getUri()));
  }

  clearResource(attribute: string, uri: string) {
    this._clearReference(attribute, uri);
    this._structure.deleteIfNotReferenced(uri);
  }

  private _clearReference(attribute: string, uri: string) {
    const refs = this.__getReferences()[attribute];
    if (!refs) { return; }

    if (refs instanceof Array && refs.length > 1) {
      const index = refs.indexOf(uri);
      if (index >= 0) {
        refs.splice(index, 1);
      }
    }
    else {
      delete this.__getReferences()[attribute];
    }

    this._structure.cleanupReverseReferenceMap(attribute, uri, this.getUri());

  }

  setSingleReference(key: string, uri: string): void {
    Preconditions.checkNotNull(uri);
    Preconditions.checkNotNull(key);
    if (!this._json.references) {
      this._json['references'] = {};
    }

    this.__getReferences()[key] = uri;
  }

  setReferences(key: string, uris: string[]): void {
    uris.forEach(uri => Preconditions.checkNotNull(uri));
    Preconditions.checkNotNull(key);
    if (!this._json.references) {
      this._json['references'] = {};
    }

    this.__getReferences()[key] = uris;
  }

  setResource(attribute: string, resource: JsonResource): void {
    this._setResource(attribute, resource);
  }

  setResources(attribute: string, resources: JsonResource[]): void {
    this._setResource(attribute, resources);
  }

  protected _setResource(attribute: string, resource: JsonResource | JsonResource[]): void {
    this.clearResources(attribute);

    if (resource instanceof Array) {
      this.setReferences(attribute, (<JsonResource[]>resource).map(res => res.getUri()));
      (<JsonResource[]>resource).forEach(res => this._tryAddIncluded(res));
    }
    else {
      this.setSingleReference(attribute, (<JsonResource>resource).getUri());
      this._tryAddIncluded(<JsonResource>resource);
    }
  }

  private _tryAddIncluded(resource: JsonResource) {
    const prev = this._structure.getByUri(resource.getUri());
    if (prev && prev == resource) return;
    else if (prev) {
      throw new Error(
        'Found different objects with same uri when adding included resource "' + resource.getUri() + '".' +
        ' (Make sure to delete original before replacing with copy)');
    }
    else this._addIncluded(resource);
  }

  private _addIncluded(resource: JsonResource) {
    this._structure.addIncluded(resource);
  }


  extractFullStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure.getSingleResourceAsFullJson(this);
  }

  getDeepCopy(): JsonResource {
    return JsonResource._wrap(JSON.parse(JSON.stringify(this.extractFullStructure().getRawJson())));
  }

  getStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure;
  }

  private __getReferences(): any {
    return this._json.references ? this._json.references : {};
  }

  private __getAttributes(): any {
    return this._json.attributes ? this._json.attributes : {};
  }

  getAllReferences(): Set<string> {
    const allRefSet = new Set<string>();
    Object.values(this.__getReferences()).forEach(refs =>
      this.getAsArray(refs).forEach(ref => allRefSet.add(ref))
    );
    return allRefSet;
  }

  private getAsArray(value: any) {
    if (value instanceof Array) { return value; }
    return [value];
  }
}

