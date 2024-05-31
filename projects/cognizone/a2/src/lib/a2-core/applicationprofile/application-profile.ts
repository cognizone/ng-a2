import { Preconditions } from '../../precondition/preconditions';
import { RdfDataType } from '../rdf/rdf-data-type';
import { StringUtil } from '../util/string-util';

export class ApplicationProfile {
  constructor(
    private readonly _uri: string,
    private readonly _types: Map<string, Type>
  ) {}

  getType(classId: string): Type {
    return this._types.get(classId);
  }

  getTypes(): Type[] {
    return Array.from(this._types.values());
  }

  get uri(): string {
    return this._uri;
  }
}

export class Type {
  constructor(
    private readonly _applicationProfile: ApplicationProfile,
    private readonly _classIds: string[],
    private readonly _attributes: Map<string, Attribute>
  ) {}

  getApplicationProfile(): ApplicationProfile {
    return this._applicationProfile;
  }

  getAttribute(attributeId: string): Attribute {
    return this._attributes.get(attributeId);
  }

  getAttributes(): Attribute[] {
    return Array.from(this._attributes.values());
  }

  getClassIds(): string[] {
    return this._classIds;
  }

  getClassId(): string {
    return this._classIds[this._classIds.length - 1]; //todo this should return the explicit final sub class
    // now it returns the last defined type (?)
  }

  hasAttribute(attributeId: string) {
    return !!this.getAttribute(attributeId);
  }
}

export class Attribute {
  constructor(
    private readonly _type: Type,
    private readonly _uri: string,
    private readonly _attributeId: string,
    private readonly _dataType: RdfDataType,
    private readonly _maxCardinality?: number,
    private readonly _minCardinality?: number,
    private readonly _rangeClassId?: string
  ) {}

  getType(): Type {
    return this._type;
  }

  getAttributeDisplayName(): string {
    return StringUtil.convertAttributeToLabel(this.getAttributeId());
  }

  getAttributeId(): string {
    return this._attributeId;
  }

  getRange(): string {
    return this._rangeClassId ? this.getDataType().shortened : this.getRangeClassId();
  }

  getDataType(): RdfDataType {
    return this._dataType;
  }

  getRangeClassId(): string {
    Preconditions.checkNotNull(this._rangeClassId);
    return this._rangeClassId;
  }

  getMaxCardinality(): number | undefined {
    return this._maxCardinality;
  }

  getMinCardinality(): number | undefined {
    return this._minCardinality;
  }

  isLiteral(): boolean {
    return !this._rangeClassId;
  }

  isTypedResource(): boolean {
    return !!this._rangeClassId;
  }

  isMany(): boolean {
    return !this._maxCardinality || this._maxCardinality > 1;
  }
}
