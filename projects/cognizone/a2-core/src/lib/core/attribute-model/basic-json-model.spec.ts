import { BasicJsonModel } from './basic-json-model';

describe('BasicJsonModel', () => {
  describe('Basic JSON Model Operations', () => {
    it('should create with json data', () => {
      const json = { id: '1', name: 'Test' };
      const model = new BasicJsonModel(json);
      expect(model.getValue('id')).toBe('1');
      expect(model.getValue('name')).toBe('Test');
    });

    it('should throw error when json is null', () => {
      expect(() => new BasicJsonModel(null)).toThrow();
    });

    it('should throw error when json is undefined', () => {
      expect(() => new BasicJsonModel(undefined)).toThrow();
    });

    it('getValue and setValue should work', () => {
      const model = new BasicJsonModel({});
      model.setValue('key', 'value');
      expect(model.getValue('key')).toBe('value');
    });

    it('clearValue should remove attribute', () => {
      const model = new BasicJsonModel({ key: 'value' });
      model.clearValue('key');
      expect(model.getValue('key')).toBeUndefined();
    });

    it('getAttributeIds should return all keys', () => {
      const model = new BasicJsonModel({ a: 1, b: 2, c: 3 });
      const ids = model.getAttributeIds();
      expect(ids).toContain('a');
      expect(ids).toContain('b');
      expect(ids).toContain('c');
      expect(ids.length).toBe(3);
    });

    it('getAttributeIds should return empty array when json is null', () => {
      const model = new BasicJsonModel({});
      model.json = null;
      expect(model.getAttributeIds()).toEqual([]);
    });

    it('getUri should return json', () => {
      const model = new BasicJsonModel({});
      expect(model.getUri()).toBe('json');
    });

    it('getDeepCopy should create independent copy', () => {
      const original = new BasicJsonModel({ nested: { value: 'test' } });
      const copy = original.getDeepCopy();
      copy.setValue('nested', { value: 'changed' });
      expect(original.getValue('nested').value).toBe('test');
      expect(copy.getValue('nested').value).toBe('changed');
    });

    it('clear should empty json object', () => {
      const model = new BasicJsonModel({ a: 1, b: 2 });
      model.clear();
      expect(model.getAttributeIds().length).toBe(0);
    });
  });

  describe('Attribute Trail Operations', () => {
    it('getObjectsByAttributeTrail should navigate through nested objects', () => {
      const json = {
        parent: {
          child: [{ id: 1 }, { id: 2 }],
        },
      };
      const model = new BasicJsonModel(json);
      const objects = model.getObjectsByAttributeTrail(['parent', 'child']);
      expect(objects.length).toBe(2);
      expect(objects[0].getValue('id')).toBe(1);
      expect(objects[1].getValue('id')).toBe(2);
    });

    it('getObjectsByAttributeTrail should filter by filters', () => {
      const json = {
        items: [
          { id: 1, type: 'A' },
          { id: 2, type: 'B' },
          { id: 3, type: 'A' },
        ],
      };
      const model = new BasicJsonModel(json);
      const objects = model.getObjectsByAttributeTrail(['items'], [{ key: 'type', value: 'A' }]);
      expect(objects.length).toBe(2);
      expect(objects.every(obj => obj.getValue('type') === 'A')).toBe(true);
    });

    it('getOneObjectByAttributeTrail should return single object', () => {
      const json = {
        items: [{ id: 1 }],
      };
      const model = new BasicJsonModel(json);
      const obj = model.getOneObjectByAttributeTrail(['items']);
      expect(obj).not.toBeNull();
      expect(obj.getValue('id')).toBe(1);
    });

    it('getOneObjectByAttributeTrail should throw when multiple objects found', () => {
      const json = {
        items: [{ id: 1 }, { id: 2 }],
      };
      const model = new BasicJsonModel(json);
      expect(() => model.getOneObjectByAttributeTrail(['items'])).toThrow('found more than one object');
    });

    it('getChildObjectsOfProperty should handle arrays', () => {
      const parent = new BasicJsonModel({ children: [{ a: 1 }, { a: 2 }] });
      const children = parent.getChildObjectsOfProperty(parent, 'children');
      expect(children.length).toBe(2);
    });

    it('getChildObjectsOfProperty should handle single object', () => {
      const parent = new BasicJsonModel({ child: { a: 1 } });
      const children = parent.getChildObjectsOfProperty(parent, 'child');
      expect(children.length).toBe(1);
      expect(children[0].getValue('a')).toBe(1);
    });

    it('getOneChildObjectOfProperty should return single child', () => {
      const parent = new BasicJsonModel({ child: { a: 1 } });
      const child = parent.getOneChildObjectOfProperty(parent, 'child');
      expect(child).not.toBeNull();
      expect(child.getValue('a')).toBe(1);
    });
  });
});
