import { ApplicationProfileBuilder } from './application-profile-builder';
import { ApplicationProfile } from './application-profile';
import { RdfDataType } from '../rdf/rdf-data-type';

describe('ApplicationProfileBuilder', () => {
  const validJson = {
    uri: 'http://example.org/profile',
    types: {
      TestClass: {
        attributes: {
          attr1: {
            uri: 'http://example.org/attr1',
            attributeId: 'attr1',
            rules: [{ name: 'range', value: { name: 'datatype', value: 'http://www.w3.org/2001/XMLSchema#string' } }],
          },
        },
      },
    },
  };

  describe('Profile Building', () => {
    it('should build ApplicationProfile from valid JSON', () => {
      const profile = new ApplicationProfileBuilder(validJson).get();
      expect(profile).toBeInstanceOf(ApplicationProfile);
      expect(profile.uri).toBe('http://example.org/profile');
      expect(profile.getType('TestClass')).toBeDefined();
    });

    it('should throw error for invalid profile structure', () => {
      expect(() => new ApplicationProfileBuilder({ uri: null, types: {} }).get()).toThrow('Fail build AP: uri" was null');
      expect(() => new ApplicationProfileBuilder({ types: {} }).get()).toThrow('Fail build AP: uri" was null');
      expect(() => new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: null }).get()).toThrow(
        'Fail build AP: types" was null'
      );
      expect(() => new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: 'not an object' }).get()).toThrow(
        'Fail build AP: types was not object'
      );
    });
  });

  describe('Type Building', () => {
    it('should throw error for invalid type structure', () => {
      expect(() => new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: { TestClass: null } }).get()).toThrow(
        'Fail build AP: type "TestClass"'
      );
      expect(() =>
        new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: { TestClass: { attributes: null } } }).get()
      ).toThrow('Fail build AP: type "TestClass" - attributes');
      expect(() => new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: { TestClass: {} } }).get()).toThrow(
        'Fail build AP: type "TestClass" - attributes'
      );
    });
  });

  describe('Attribute Building', () => {
    it('should build attributes with different range types', () => {
      const createProfile = (rangeType: string, rangeValue: any) =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: {
                attr1: {
                  uri: 'http://example.org/attr1',
                  attributeId: 'attr1',
                  rules: [{ name: 'range', value: { name: rangeType, value: rangeValue } }],
                },
              },
            },
          },
        }).get();

      const datatypeProfile = createProfile('datatype', 'http://www.w3.org/2001/XMLSchema#string');
      expect(datatypeProfile.getType('TestClass').getAttribute('attr1').isLiteral()).toBe(true);

      const classIdProfile = createProfile('classId', 'RangeClassId');
      expect(classIdProfile.getType('TestClass').getAttribute('attr1').isTypedResource()).toBe(true);
      expect(classIdProfile.getType('TestClass').getAttribute('attr1').getRangeClassId()).toBe('RangeClassId');

      const languageProfile = createProfile('languageIn', 'en');
      expect(languageProfile.getType('TestClass').getAttribute('attr1').getDataType()).toBe(RdfDataType.TYPES.rdf_langString);

      const snippetProfile = new ApplicationProfileBuilder({
        uri: 'http://example.org/profile',
        types: {
          TestClass: {
            attributes: {
              attr1: {
                uri: 'http://example.org/attr1',
                attributeId: 'attr1',
                rules: [{ name: 'snippet', value: true }],
              },
            },
          },
        },
      }).get();
      expect(snippetProfile.getType('TestClass').getAttribute('attr1')).toBeDefined();
    });

    it('should throw error for invalid attribute properties', () => {
      expect(() =>
        new ApplicationProfileBuilder({ uri: 'http://example.org/profile', types: { TestClass: { attributes: { attr1: null } } } }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" ');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: { TestClass: { attributes: { attr1: { uri: null, attributeId: 'attr1', rules: [] } } } },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" uri" was null');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: { TestClass: { attributes: { attr1: { uri: 'http://example.org/attr1', attributeId: null, rules: [] } } } },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1"  - attributeId" was null');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: { TestClass: { attributes: { attr1: { uri: 'http://example.org/attr1', attributeId: 'attr1', rules: null } } } },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" rules" was null');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: { TestClass: { attributes: { attr1: { uri: 'http://example.org/attr1', attributeId: 'attr1', rules: 'not an array' } } } },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" rules was not array');
    });

    it('should throw error for invalid rules', () => {
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: { attr1: { uri: 'http://example.org/attr1', attributeId: 'attr1', rules: [{ name: null, value: 'test' }] } },
            },
          },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1"  rule name" was null');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: {
                attr1: {
                  uri: 'http://example.org/attr1',
                  attributeId: 'attr1',
                  rules: [
                    { name: 'range', value: { name: 'datatype', value: 'http://www.w3.org/2001/XMLSchema#string' } },
                    { name: 'minCardinality', value: 1 },
                    { name: 'minCardinality', value: 2 },
                  ],
                },
              },
            },
          },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" rule "minCardinality" was defined twice ');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: { attr1: { uri: 'http://example.org/attr1', attributeId: 'attr1', rules: [{ name: 'range', value: null }] } },
            },
          },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1" range value" was null');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: {
                attr1: {
                  uri: 'http://example.org/attr1',
                  attributeId: 'attr1',
                  rules: [{ name: 'range', value: { name: 'unknownRange', value: 'test' } }],
                },
              },
            },
          },
        }).get()
      ).toThrow('Unknown range name unknownRange');
      expect(() =>
        new ApplicationProfileBuilder({
          uri: 'http://example.org/profile',
          types: {
            TestClass: {
              attributes: {
                attr1: { uri: 'http://example.org/attr1', attributeId: 'attr1', rules: [{ name: 'minCardinality', value: 1 }] },
              },
            },
          },
        }).get()
      ).toThrow('Fail build AP: type "attr1", attribute "attr1"  range was not defined');
    });
  });
});
