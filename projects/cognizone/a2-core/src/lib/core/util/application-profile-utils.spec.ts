import { ApplicationProfileUtils } from './application-profile-utils';
import { ApplicationProfile, Type, Attribute } from '../applicationprofile/application-profile';
import { RdfDataType } from '../rdf/rdf-data-type';

describe('ApplicationProfileUtils', () => {
  let applicationProfile1: ApplicationProfile;
  let applicationProfile2: ApplicationProfile;
  let type1: Type;
  let type2: Type;

  beforeEach(() => {
    const typesMap1 = new Map<string, Type>();
    const typesMap2 = new Map<string, Type>();
    const attributesMap1 = new Map<string, Attribute>();
    const attributesMap2 = new Map<string, Attribute>();

    applicationProfile1 = new ApplicationProfile('http://example.org/profile1', typesMap1);
    applicationProfile2 = new ApplicationProfile('http://example.org/profile2', typesMap2);

    type1 = new Type(applicationProfile1, ['Class1'], attributesMap1);
    type2 = new Type(applicationProfile2, ['Class2'], attributesMap2);

    typesMap1.set('Class1', type1);
    typesMap2.set('Class2', type2);
  });

  describe('mergeProfiles', () => {
    it('should merge multiple profiles', () => {
      const merged = ApplicationProfileUtils.mergeProfiles('http://merged', applicationProfile1, applicationProfile2);
      expect(merged.getTypes().length).toBe(2);
    });

    it('should throw error when no profiles provided', () => {
      expect(() => ApplicationProfileUtils.mergeProfiles('http://merged')).toThrow();
    });
  });

  describe('mergeTypes', () => {
    it('should merge multiple types', () => {
      const attributesMap3 = new Map<string, Attribute>();
      const attribute3 = new Attribute(type1, 'http://example.org/attr3', 'attr3', RdfDataType.TYPES.xsd_string);
      attributesMap3.set('attr3', attribute3);
      const type3 = new Type(applicationProfile1, ['Class3'], attributesMap3);

      const merged = ApplicationProfileUtils.mergeTypes([type1, type3]);
      expect(merged.getClassIds().length).toBe(2);
    });

    it('should throw error when no types provided', () => {
      expect(() => ApplicationProfileUtils.mergeTypes([])).toThrow();
    });
  });

  describe('getLiteralAttributes', () => {
    it('should return only literal attributes', () => {
      const attributesMap = new Map<string, Attribute>();
      const literalAttr = new Attribute(type1, 'http://example.org/literal', 'literalAttr', RdfDataType.TYPES.xsd_string);
      attributesMap.set('literalAttr', literalAttr);
      const testType = new Type(applicationProfile1, ['TestClass'], attributesMap);

      const result = ApplicationProfileUtils.getLiteralAttributes(testType);
      expect(result.every(a => a.isLiteral())).toBe(true);
    });
  });

  describe('getResourceAttributes', () => {
    it('should return only resource attributes', () => {
      const attributesMap = new Map<string, Attribute>();
      const resourceAttr = new Attribute(
        type1,
        'http://example.org/resource',
        'resourceAttr',
        RdfDataType.TYPES.rdfs_Resource,
        undefined,
        undefined,
        'RangeClassId'
      );
      attributesMap.set('resourceAttr', resourceAttr);
      const testType = new Type(applicationProfile1, ['TestClass'], attributesMap);

      const result = ApplicationProfileUtils.getResourceAttributes(testType);
      expect(result.every(a => a.isTypedResource())).toBe(true);
    });
  });
});
