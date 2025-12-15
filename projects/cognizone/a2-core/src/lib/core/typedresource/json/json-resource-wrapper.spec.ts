import { JsonResourceWrapper, SingleJsonResourceWrapper, MultiJsonResourceWrapper } from './json-resource-wrapper';
import { JsonResource } from './json-resource';
import { JsonResourceFactory } from './json-resource-factory';

class MockJsonResource extends JsonResource {
  constructor(json: Record<string, unknown>, structure: JsonResourceWrapper<JsonResource>) {
    super(json, structure);
  }
}

class TestableJsonResourceWrapper extends JsonResourceWrapper<MockJsonResource> {
  constructor(root: Record<string, unknown>, factory: JsonResourceFactory<MockJsonResource>) {
    super(root, factory);
  }
}

describe('JsonResourceWrapper', () => {
  let factory: JsonResourceFactory<MockJsonResource>;

  beforeEach(() => {
    factory = (json: Record<string, unknown>, structure: JsonResourceWrapper<MockJsonResource>) => {
      return new MockJsonResource(json, structure);
    };
  });

  describe('Resource Structure', () => {
    it('should throw error when root is null', () => {
      expect(() => new TestableJsonResourceWrapper(null as unknown as Record<string, unknown>, factory)).toThrow();
    });

    it('getByUri should return resource when it exists', () => {
      const root = {
        data: { uri: 'test-uri', type: 'Test' },
        included: [{ uri: 'included-uri', type: 'Included' }],
      };
      const wrapper = new SingleJsonResourceWrapper(root, factory);
      expect(wrapper.getByUri('test-uri')?.getUri()).toBe('test-uri');
    });
  });
});

describe('SingleJsonResourceWrapper', () => {
  let factory: JsonResourceFactory<MockJsonResource>;

  beforeEach(() => {
    factory = (json: Record<string, unknown>, structure: JsonResourceWrapper<MockJsonResource>) => {
      return new MockJsonResource(json, structure);
    };
  });

  describe('Single Resource Handling', () => {
    it('should create with single resource', () => {
      const root = { data: { uri: 'test-uri', type: 'Test' } };
      const wrapper = new SingleJsonResourceWrapper(root, factory);
      expect(wrapper.getRoot().getUri()).toBe('test-uri');
    });

    it('should throw error when data is array', () => {
      const root = { data: [{ uri: 'uri1' }] };
      expect(() => new SingleJsonResourceWrapper(root, factory)).toThrow();
    });
  });
});

describe('MultiJsonResourceWrapper', () => {
  let factory: JsonResourceFactory<MockJsonResource>;

  beforeEach(() => {
    factory = (json: Record<string, unknown>, structure: JsonResourceWrapper<MockJsonResource>) => {
      return new MockJsonResource(json, structure);
    };
  });

  describe('Multiple Resources Handling', () => {
    it('should create with multiple resources', () => {
      const root = {
        data: [
          { uri: 'uri1', type: 'Type1' },
          { uri: 'uri2', type: 'Type2' },
        ],
      };
      const wrapper = new MultiJsonResourceWrapper(root, factory);
      expect(wrapper.getRoots().length).toBe(2);
    });

    it('should throw error when data is not array', () => {
      const root = { data: { uri: 'single-uri', type: 'Type' } };
      expect(() => new MultiJsonResourceWrapper(root, factory)).toThrow();
    });
  });
});

describe('JsonResourceWrapper - Children and Parents', () => {
  let factory: JsonResourceFactory<MockJsonResource>;
  let wrapper: SingleJsonResourceWrapper<MockJsonResource>;

  beforeEach(() => {
    factory = (json: Record<string, unknown>, structure: JsonResourceWrapper<MockJsonResource>) => {
      return new MockJsonResource(json, structure);
    };

    const root = {
      data: {
        uri: 'parent-uri',
        type: 'Parent',
        references: {
          childRef: ['child1-uri'],
        },
      },
      included: [{ uri: 'child1-uri', type: 'Child1' }],
    };

    wrapper = new SingleJsonResourceWrapper(root, factory);
  });

  describe('Resource Relationships', () => {
    it('getChildrenByReference should return children', () => {
      const parent = wrapper.getRoot();
      const children = wrapper.getChildrenByReference('childRef', parent);
      expect(children.length).toBe(1);
    });

    it('getParents should return all parents', () => {
      const child = wrapper.getByUri('child1-uri');
      expect(wrapper.getParents(child).length).toBe(1);
    });
  });
});
