import { JsonResourceWrapper, MultiJsonResourceWrapper, SingleJsonResourceWrapper } from './json-resource-wrapper';
import { RdfDataType } from '../../rdf/rdf-data-type';
import { JsonResourceFactory } from './json-resource-factory';
import { Preconditions } from '../../../precondition/preconditions';

export const BasicJsonResourceFactory: JsonResourceFactory<JsonResource> = (rawJson, structure) => new JsonResource(rawJson, structure);

export class JsonResource {
  public static _wrap(jsonRoot: any = { data: {} }): JsonResource {
    const structure = new SingleJsonResourceWrapper<JsonResource>(jsonRoot, BasicJsonResourceFactory);
    return structure.getRoot();
  }

  public static _wrapMany(jsonRoot: any = { data: [] }): JsonResource[] {
    const structure = new MultiJsonResourceWrapper<JsonResource>(jsonRoot, BasicJsonResourceFactory);
    return structure.getRoots();
  }

  public static _create(uri: string, type: string[]): JsonResource {
    return JsonResource._wrap({ data: { uri: uri, type: type } });
  }

  private _json: any;
  private _structure: JsonResourceWrapper<JsonResource>;

  constructor(json: any, structure: JsonResourceWrapper<JsonResource>) {
    Preconditions.checkNotNull(json, () => 'json was null');
    this._json = json;
    this._structure = structure;
  }

  public getRawJson() {
    return this._json;
  }

  public getUri(): string {
    return this._json.uri;
  }

  public isEmptyResource(): boolean {
    return Object.keys(this.__getAttributes()).length == 0 && Object.keys(this.__getReferences()).length == 0;
  }

  public setUri(uri: string): void {
    this._json['uri'] = uri;
  }

  public setType(type: string) {
    this._json['type'] = type;
  }

  public getType() {
    return this._json.type;
  }

  public getValueWithDataType(attributeId: string, dataType?: RdfDataType) {
    const attrib = this.__getAttributes()[attributeId];
    if (!attrib) {
      return null;
    }
    return dataType ? attrib[dataType.shortened] : Object.values(attrib).pop();
  }

  public setValueWithDataType(attributeId: string, value: any, dataType: RdfDataType) {
    if (!this._json.attributes) this._json['attributes'] = {};
    const obj = {};
    obj[dataType.shortened] = value;
    this.__getAttributes()[attributeId] = obj;
  }

  public getLangString(key: string, lang: string): string {
    const attrib = this.getValueWithDataType(key, RdfDataType.TYPES.rdf_langString);
    return attrib ? attrib[lang] : null;
  }

  public getLangStrings(key: string, lang: string): string[] {
    return <string[]>(<unknown>this.getLangString(key, lang));
  }

  public getXsdString(key: string): string {
    return this.getValueWithDataType(key, RdfDataType.TYPES.xsd_string);
  }

  public getXsdStrings(key: string): string[] {
    return <string[]>(<unknown>this.getXsdString(key));
  }

  public getResources(attributeId: string): JsonResource[] {
    return this.getStructure().getChildrenByReference(attributeId, this);
  }

  public getResource(attributeId: string): JsonResource {
    const children = this.getResources(attributeId);

    Preconditions.checkState(children.length <= 1);
    return children.length == 1 ? children[0] : null;
  }

  public getParents(attributeId?: string) {
    return attributeId ? this._structure.getParentsByReference(attributeId, this) : this._structure.getParents(this);
  }

  public getParent(attributeId: string) {
    return this._structure.getParentsByReference(attributeId, this).pop();
  }

  public getReference(attribute: string): string {
    return this.__getReferences()[attribute];
  }

  public getReferences(attribute: string): string[] {
    return this.__getReferences()[attribute];
  }

  public clearValue(attributeId: string): void {
    const attr = this.__getAttributes()[attributeId];
    if (!attr) {
      this.clearResources(attributeId);
    } else {
      this.__getAttributes()[attributeId] = [];
    }
  }

  public clearResources(attributeId: string): void {
    const existing = this.getResources(attributeId);
    existing.forEach(resource => this.clearResource(attributeId, resource.getUri()));
  }

  public clearResource(attributeId: string, uri: string) {
    this._clearReference(attributeId, uri);
    this._structure.deleteIfNotReferenced(uri);
  }

  private _clearReference(attributeId: string, uri: string): void {
    const refs = this.__getReferences()[attributeId];
    if (!refs) {
      return;
    }

    if (refs instanceof Array && refs.length > 1) {
      const index = refs.indexOf(uri);
      if (index >= 0) {
        refs.splice(index, 1);
      }
    } else {
      this.__getReferences()[attributeId] = [];
    }
    this._structure.cleanupReverseReferenceMap(attributeId, uri, this.getUri());
  }

  public ignoreAttribute(attributeId: string) {
    delete this.__getAttributes()[attributeId];
    this.clearResources(attributeId);
    delete this.__getReferences()[attributeId];
  }

  public setSingleReference(key: string, uri: string): void {
    Preconditions.checkNotNull(uri);
    Preconditions.checkNotNull(key);
    if (!this._json.references) {
      this._json['references'] = {};
    }
    this.__getReferences()[key] = uri;
  }

  public setReferences(key: string, uris: string[]): void {
    uris.forEach(uri => Preconditions.checkNotNull(uri));
    Preconditions.checkNotNull(key);
    if (!this._json.references) {
      this._json['references'] = {};
    }

    this.__getReferences()[key] = uris;
  }

  public setResource(attribute: string, resource: JsonResource): void {
    this._setResource(attribute, resource);
  }

  public setResources(attribute: string, resources: JsonResource[]): void {
    this._setResource(attribute, resources);
  }

  protected _setResource(attribute: string, resource: JsonResource | JsonResource[]): void {
    this.ignoreAttribute(attribute);

    if (resource instanceof Array) {
      this.setReferences(
        attribute,
        (<JsonResource[]>resource).map(res => res.getUri())
      );
      (<JsonResource[]>resource).forEach(res => this._tryAddIncluded(res));
    } else {
      this.setSingleReference(attribute, (<JsonResource>resource).getUri());
      this._tryAddIncluded(<JsonResource>resource);
    }
  }

  private _tryAddIncluded(resource: JsonResource) {
    const prev = this._structure.getByUri(resource.getUri());
    if (prev && prev == resource) return;
    else if (prev) {
      throw new Error(
        'Found different objects with same uri when adding included resource "' +
          resource.getUri() +
          '".' +
          ' (Make sure to delete original before replacing with copy)'
      );
    } else this.addIncluded(resource);
  }

  public addIncluded(resource: JsonResource) {
    this._structure.addIncluded(resource);
  }

  public extractFullStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure.getSingleResourceAsFullJson(this);
  }

  public getDeepCopy(): JsonResource {
    return JsonResource._wrap(JSON.parse(JSON.stringify(this.extractFullStructure().getRawJson())));
  }

  public getStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure;
  }

  private __getReferences(): any {
    return this._json.references || {};
  }

  private __getAttributes(): any {
    return this._json.attributes || {};
  }

  public getAllReferences(): Set<string> {
    const allRefSet = new Set<string>();
    Object.values(this.__getReferences()).forEach(refs => this.getAsArray(refs).forEach(ref => allRefSet.add(ref)));
    return allRefSet;
  }

  private getAsArray(value: any) {
    if (value instanceof Array) {
      return value;
    }
    return [value];
  }
}
