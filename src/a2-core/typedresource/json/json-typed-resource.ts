import {TypedResource} from '../typed-resource';
import {JsonResourceWrapper, MultiJsonResourceWrapper, SingleJsonResourceWrapper} from './json-resource-wrapper';
import {ApplicationProfile, Attribute, Type} from '../../applicationprofile/application-profile';
import {ApplicationProfileUtils} from '../../util/application-profile-utils';
import {RdfDataType} from '../../rdf/rdf-data-type';
import {JsonResource} from './json-resource';
import {Preconditions} from "../../../precondition/preconditions";

export class JsonTypedResource extends JsonResource implements TypedResource {

  public static wrap(profile: ApplicationProfile, jsonRoot: any): JsonTypedResource {
    const structure = new SingleJsonResourceWrapper<JsonTypedResource>(jsonRoot, new TypedFactory(profile).get());
    return structure.getRoot();
  }

  public static wrapMany(profile: ApplicationProfile, jsonRoot: any = { data: [] }): JsonTypedResource[] {
    const structure = new MultiJsonResourceWrapper<JsonTypedResource>(jsonRoot, new TypedFactory(profile).get());
    return structure.getRoots();
  }

  public static create(profile: ApplicationProfile, uri: string, type: string[]): JsonTypedResource {
    return JsonTypedResource.wrap(profile, { data: { uri: uri, type: type } });
  }

  private _type: Type;

  constructor(json: any, structure: JsonResourceWrapper<JsonTypedResource>, type: Type) {
    super(json, structure);
    Preconditions.checkNotNull(json, () => 'json was null');
    this._type = type;
  }

  public getType(): Type {
    return this._type;
  }

  public getValue(attributeId: string): any {
    const attribute = this.getAttribute(attributeId);

    if (attribute.isTypedResource()) { return this._getResource(attributeId); }

    const dataType = attribute.getDataType();
    return this.getValueWithDataType(attributeId, dataType.equals(RdfDataType.TYPES.rdfs_Literal) ? null : dataType);
    // todo revise logic for rdfs:Literal
  }

  public setValue(attributeId: string, value: any): void {
    const attribute = this.getAttribute(attributeId);
    if (attribute.isTypedResource()) {
      return this._setTypedResource(attribute, value);
    }

    const dataType = attribute.getDataType();
    this.setValueWithDataType(attributeId, value, dataType);
  }

  public addValue(attributeId: string, value: any): void {
    Preconditions.checkState(!(value instanceof Array));

    const previous = this.getValue(attributeId);

    console.log(previous);

    if (previous instanceof Array) {
      this.setValue(attributeId, [...previous, value])
    }
    else if (!previous) {
      this.setValue(attributeId, value);
    }
    else {
      this.setValue(attributeId, [previous, value]);
    }
  }

  private getAttribute(attributeId: string): Attribute {
    let attribute = this._type.getAttribute(attributeId);
    Preconditions.checkNotNull(attribute,
      () => "attribute '" + attributeId + "' not defined for type '" + this._type.getClassId() + "'");
    return attribute;
  }

  public getResources(attributeId: string): JsonTypedResource[] {
    this.getAttribute(attributeId);
    return <JsonTypedResource[]>super.getResources(attributeId);
  }

  public getResource(attributeId: string): JsonTypedResource {
    return <JsonTypedResource>super.getResource(attributeId);
  }

  private _getResource(attributeId: string): JsonTypedResource | JsonTypedResource[] {
    let attribute = this._type.getAttribute(attributeId);
    return attribute.isMany() ? this.getResources(attributeId) : this.getResources(attributeId);
  }

  private _setTypedResource(attribute: Attribute, resource: JsonResource | JsonResource[]) {
    if (attribute.isMany()) {
      if (!(resource instanceof Array)) {
        Preconditions.checkNotNull(resource.getUri());
        resource = [resource];
      }
      this.setResources(attribute.getAttributeId(), resource);
    }
    else {
      Preconditions.checkState(!(resource instanceof Array));
      Preconditions.checkNotNull((<JsonResource>resource).getUri());
      this.setResource(attribute.getAttributeId(), <JsonResource>resource);
    }
  }

  public getStructure(): JsonResourceWrapper<JsonTypedResource> {
    return <JsonResourceWrapper<JsonTypedResource>>((<unknown>super.getStructure()));
  }

  public extractFullStructure(): JsonResourceWrapper<JsonResource> {
    return <JsonResourceWrapper<JsonTypedResource>>((<unknown>super.getStructure()));
  }

  public getDeepCopy(profile?: ApplicationProfile): JsonTypedResource {
    return JsonTypedResource.wrap(
      profile ? profile : this._type.getApplicationProfile(),
      JSON.parse(JSON.stringify(this.extractFullStructure().getRawJson()))
    );
  }
}

export class TypedFactory {
  private _profile: ApplicationProfile;

  constructor(profile: ApplicationProfile) {
    this._profile = profile;
  }

  get(): (rawJson: any, structure: JsonResourceWrapper<JsonTypedResource>) => JsonTypedResource {
    return (rawJson, structure) => {
      let typeIds: any = rawJson['type'];
      Preconditions.checkNotNull(typeIds, () => 'Type id was null');
      if (!(typeIds instanceof Array)) { typeIds = [typeIds]; }
      const types: Type[] = typeIds.map(typeId => {
        let type = this._profile.getType(typeId);
        Preconditions.checkNotNull(type, () => 'Type was null for typeId "' + typeId + '"');
        return type;
      });
      return new JsonTypedResource(rawJson, structure, ApplicationProfileUtils.mergeTypes(types));
    }
  }
}
