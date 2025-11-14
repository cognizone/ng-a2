import { ApplicationProfile, Type, Attribute } from './application-profile';
import { RdfDataType } from '../rdf/rdf-data-type';

describe('ApplicationProfile', () => {
  let applicationProfile: ApplicationProfile;
  let type: Type;

  beforeEach(() => {
    const typesMap = new Map<string, Type>();
    const attributesMap = new Map<string, Attribute>();

    applicationProfile = new ApplicationProfile('http://example.org/profile', typesMap);
    type = new Type(applicationProfile, ['Class1'], attributesMap);
    typesMap.set('Class1', type);
  });

  it('should create with uri and types', () => {
    expect(applicationProfile.uri).toBe('http://example.org/profile');
    expect(applicationProfile.getType('Class1')).toBe(type);
  });

  it('getTypes should return all types', () => {
    expect(applicationProfile.getTypes().length).toBe(1);
  });
});

describe('Type', () => {
  let applicationProfile: ApplicationProfile;
  let type: Type;
  let attribute: Attribute;

  beforeEach(() => {
    const typesMap = new Map<string, Type>();
    const attributesMap = new Map<string, Attribute>();

    applicationProfile = new ApplicationProfile('http://example.org/profile', typesMap);
    type = new Type(applicationProfile, ['TestClass'], attributesMap);
    attribute = new Attribute(type, 'http://example.org/attr1', 'attr1', RdfDataType.TYPES.xsd_string);
    attributesMap.set('attr1', attribute);
  });

  it('should create with attributes', () => {
    expect(type.getAttribute('attr1')).toBe(attribute);
    expect(type.hasAttribute('attr1')).toBe(true);
  });

  it('getClassId should return last classId', () => {
    expect(type.getClassId()).toBe('TestClass');
  });
});

describe('Attribute', () => {
  let type: Type;
  let literalAttribute: Attribute;
  let resourceAttribute: Attribute;

  beforeEach(() => {
    const typesMap = new Map<string, Type>();
    const attributesMap = new Map<string, Attribute>();
    const applicationProfile = new ApplicationProfile('http://example.org/profile', typesMap);
    type = new Type(applicationProfile, ['TestClass'], attributesMap);

    literalAttribute = new Attribute(type, 'http://example.org/literal', 'literalAttr', RdfDataType.TYPES.xsd_string);
    resourceAttribute = new Attribute(
      type,
      'http://example.org/resource',
      'resourceAttr',
      RdfDataType.TYPES.rdfs_Resource,
      undefined,
      undefined,
      'RangeClassId'
    );
  });

  it('should create with properties', () => {
    expect(literalAttribute.getAttributeId()).toBe('literalAttr');
    expect(literalAttribute.isLiteral()).toBe(true);
    expect(resourceAttribute.isTypedResource()).toBe(true);
  });

  it('getRangeClassId should throw error when not present', () => {
    expect(() => literalAttribute.getRangeClassId()).toThrow();
  });
});
