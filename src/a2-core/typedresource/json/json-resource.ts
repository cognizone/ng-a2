import {JsonResourceWrapper, MultiJsonResourceWrapper, SingleJsonResourceWrapper} from './json-resource-wrapper';
import {RdfDataType} from '../../rdf/rdf-data-type';
import {JsonResourceFactory} from './json-resource-factory';
import {Preconditions} from "../../../precondition/preconditions";

export class JsonResource {
  public static _wrap(jsonRoot: any = { data: {} }): JsonResource {
    const structure = new SingleJsonResourceWrapper<JsonResource>(
      jsonRoot,
      new BasicJsonResourceFactory()
    );
    return structure.getRoot();
  }

  public static _wrapMany(jsonRoot: any = { data: [] }): JsonResource[] {
    const structure = new MultiJsonResourceWrapper<JsonResource>(
      jsonRoot,
      new BasicJsonResourceFactory()
    );
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

  getRawJson() {
    return this._json;
  }

  getUri(): string {
    return this._json.uri;
  }

  isEmptyResource(): boolean {
    return (
      Object.keys(this._getAttributes()).length == 0 &&
      Object.keys(this._getReferences()).length == 0
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
    const attrib = this._getAttributes()[attributeId];
    if (!attrib) { return null; }
    return dataType ? attrib[dataType.shortened] : Object.values(attrib).pop();
  }

  setValueWithDataType(attributeId: string, value: any, dataType: RdfDataType) {
    if (!this._json.attributes) this._json['attributes'] = {};
    const obj = {};
    obj[dataType.shortened] = value;
    this._getAttributes()[attributeId] = obj;
  }

  getLangString(key: string, lang: string): string {
    const attrib = this.getValueWithDataType(
      key,
      RdfDataType.TYPES.rdf_langString
    );
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

  clearValue(attributeId: string): void {
    delete this._getAttributes()[attributeId];
    delete this._getReferences()[attributeId];
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

  addIncluded(resource: JsonResource) {
    if (this._structure.getByUri(resource.getUri())) { return; }
    this._structure.addIncluded(resource);
  }

  getReference(reference: string): string {
    return this._getReferences()[reference];
  }

  getReferences(reference?: string): string[] {
    return reference
      ? this._getReferences()[reference]
      : this.getAllReferences();
  }

  // todo untested
  deleteReference(key: string, uri?: string): void {
    const refs = this._getReferences()[key];
    if (!refs) { return; }

    if (uri && refs instanceof Array && refs.length > 1) {
      const index = refs.indexOf(uri);
      if (index >= 0) { refs.splice(index, 1); }
    } else {
      delete this._getReferences()[key];
    }
  }

  setSingleReference(key: string, uri: string): void {
    if (!this._json.references) {
      this._json['references'] = {};
    }

    this._getReferences()[key] = uri;
  }

  setReferences(key: string, uris: string[]): void {
    if (!this._json.references) {
      this._json['references'] = {};
    }

    this._getReferences()[key] = uris;
  }

  public extractFullStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure.getSingleResourceAsFullJson(this);
  }

  public getDeepCopy(): JsonResource {
    return JsonResource._wrap(
      JSON.parse(JSON.stringify(this.extractFullStructure().getRawJson()))
    );
  }

  public getStructure(): JsonResourceWrapper<JsonResource> {
    return this._structure;
  }

  private _getReferences(): any {
    return this._json.references ? this._json.references : {};
  }

  private _getAttributes(): any {
    return this._json.attributes ? this._json.attributes : {};
  }

  private getAllReferences(): string[] {
    const allRefSet = new Set<string>();
    Object.values(this._getReferences()).forEach(refs =>
      this.getAsArray(refs).forEach(ref => allRefSet.add(ref))
    );

    return Array.from(allRefSet);
  }

  private getAsArray(value: any) {
    if (value instanceof Array) { return value; }
    return [value];
  }
}

export class BasicJsonResourceFactory
  implements JsonResourceFactory<JsonResource> {
  wrap(
    rawJson: any,
    structure: JsonResourceWrapper<JsonResource>
  ): JsonResource {
    return new JsonResource(rawJson, structure);
  }
}
