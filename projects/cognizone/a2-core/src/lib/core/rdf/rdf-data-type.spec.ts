import { RdfDataType } from './rdf-data-type';
import { Namespace } from './namespace';

describe('RdfDataType', () => {
  describe('RDF Data Type Management', () => {
    it('should create with uri, name, and namespace', () => {
      const dataType = new RdfDataType('http://example.org/type', 'type', 'http://example.org/', 'ex');
      expect(dataType.uri).toBe('http://example.org/type');
      expect(dataType.name).toBe('type');
      expect(dataType.namespace).toBe('http://example.org/');
      expect(dataType.shortened).toBe('ex:type');
    });

    it('should create shortened form when commonPrefix and name provided', () => {
      const dataType = RdfDataType.define('string', Namespace.XSD);
      expect(dataType.shortened).toBe('xsd:string');
    });

    it('should use full uri as shortened when no commonPrefix', () => {
      const dataType = new RdfDataType('http://example.org/customType');
      expect(dataType.shortened).toBe('http://example.org/customType');
    });

    it('equals should compare by uri', () => {
      const type1 = RdfDataType.define('string', Namespace.XSD);
      const type2 = RdfDataType.define('string', Namespace.XSD);
      expect(type1.equals(type2)).toBe(true);
    });

    it('equals should return false for different types', () => {
      const type1 = RdfDataType.define('string', Namespace.XSD);
      const type2 = RdfDataType.define('boolean', Namespace.XSD);
      expect(type1.equals(type2)).toBe(false);
    });

    it('getByUri should return existing type from TYPES', () => {
      const type = RdfDataType.getByUri(Namespace.XSD.uri + 'string');
      expect(type).toBe(RdfDataType.TYPES.xsd_string);
    });

    it('getByUri should create new type when not found', () => {
      const type = RdfDataType.getByUri('http://example.org/unknown');
      expect(type.uri).toBe('http://example.org/unknown');
      expect(type.name).toBeUndefined();
    });

    it('TYPES should contain predefined types', () => {
      expect(RdfDataType.TYPES.xsd_string).toBeDefined();
      expect(RdfDataType.TYPES.xsd_boolean).toBeDefined();
      expect(RdfDataType.TYPES.rdfs_Resource).toBeDefined();
    });
  });
});
