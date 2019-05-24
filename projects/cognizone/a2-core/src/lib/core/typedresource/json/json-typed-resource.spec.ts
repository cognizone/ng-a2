import { JsonTypedResource, TypedFactory } from './json-typed-resource';
import { ApplicationProfile, Type, Attribute } from '../../applicationprofile/application-profile';
import { RdfDataType } from '../../rdf/rdf-data-type';
import { SingleJsonResourceWrapper } from './json-resource-wrapper';

describe('JsonTypedResource', () => {
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
    typesMap.set('TestClass', type);
  });

  it('wrap should create JsonTypedResource', () => {
    const jsonRoot = {
      data: {
        uri: 'test-uri',
        type: 'TestClass',
        attributes: {
          attr1: { 'xsd:string': 'test-value' },
        },
      },
    };
    const resource = JsonTypedResource.wrap(applicationProfile, jsonRoot);
    expect(resource.getUri()).toBe('test-uri');
    expect(resource.getType()).toBe(type);
  });

  it('getValue and setValue should work', () => {
    const jsonRoot = {
      data: {
        uri: 'test-uri',
        type: 'TestClass',
        attributes: {
          attr1: { 'xsd:string': 'test-value' },
        },
      },
    };
    const resource = JsonTypedResource.wrap(applicationProfile, jsonRoot);
    resource.setValue('attr1', 'new-value');
    expect(resource.getValue('attr1')).toBe('new-value');
  });

  it('addValue should add value to array', () => {
    const resource = JsonTypedResource.create(applicationProfile, 'test-uri', ['TestClass']);
    resource.setValue('attr1', ['value1']);
    resource.addValue('attr1', 'value2');
    expect(resource.getValue('attr1')).toEqual(['value1', 'value2']);
  });
});

describe('TypedFactory', () => {
  let applicationProfile: ApplicationProfile;
  let type: Type;

  beforeEach(() => {
    const typesMap = new Map<string, Type>();
    const attributesMap = new Map<string, Attribute>();

    applicationProfile = new ApplicationProfile('http://example.org/profile', typesMap);
    type = new Type(applicationProfile, ['TestClass'], attributesMap);
    typesMap.set('TestClass', type);
  });

  it('get should return factory function', () => {
    const factory = new TypedFactory(applicationProfile);
    const factoryFn = factory.get();

    const rawJson = {
      uri: 'test-uri',
      type: 'TestClass',
    };
    const wrapper = new SingleJsonResourceWrapper({ data: rawJson }, factoryFn);
    const resource = factoryFn(rawJson, wrapper);

    expect(resource.getUri()).toBe('test-uri');
    expect(resource.getType()).toBe(type);
  });

  it('get should throw error when type does not exist', () => {
    const factory = new TypedFactory(applicationProfile);
    const factoryFn = factory.get();

    const rawJson = {
      uri: 'test-uri',
      type: 'NonExistentClass',
    };

    expect(() => new SingleJsonResourceWrapper({ data: rawJson }, factoryFn)).toThrow();
  });
});
