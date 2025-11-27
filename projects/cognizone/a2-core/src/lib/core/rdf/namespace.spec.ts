import { Namespace } from './namespace';

describe('Namespace', () => {
  describe('RDF Namespace Management', () => {
    it('should create namespace with uri and commonPrefix', () => {
      const namespace = new Namespace('http://example.org/', 'ex');
      expect(namespace.uri).toBe('http://example.org/');
      expect(namespace.commonPrefix).toBe('ex');
    });

    it('RDF namespace should be defined', () => {
      expect(Namespace.RDF.uri).toBe('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
      expect(Namespace.RDF.commonPrefix).toBe('rdf');
    });

    it('RDFS namespace should be defined', () => {
      expect(Namespace.RDFS.uri).toBe('http://www.w3.org/2000/01/rdf-schema#');
      expect(Namespace.RDFS.commonPrefix).toBe('rdfs');
    });

    it('XSD namespace should be defined', () => {
      expect(Namespace.XSD.uri).toBe('http://www.w3.org/2001/XMLSchema#');
      expect(Namespace.XSD.commonPrefix).toBe('xsd');
    });
  });
});
