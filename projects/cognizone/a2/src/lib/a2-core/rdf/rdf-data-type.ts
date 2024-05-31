import { Namespace } from './namespace';

export class RdfDataType {
  public static readonly TYPES = {
    rdfs_Resource: RdfDataType.define('Resource', Namespace.RDFS),
    rdfs_Literal: RdfDataType.define('Literal', Namespace.RDFS),
    xsd_string: RdfDataType.define('string', Namespace.XSD),
    xsd_anyURI: RdfDataType.define('anyUri', Namespace.XSD),
    xsd_boolean: RdfDataType.define('boolean', Namespace.XSD),
    xsd_float: RdfDataType.define('float', Namespace.XSD),
    xsd_date: RdfDataType.define('date', Namespace.XSD),
    xsd_dateTime: RdfDataType.define('dateTime', Namespace.XSD),
    xsd_decimal: RdfDataType.define('decimal', Namespace.XSD),
    rdf_langString: RdfDataType.define('langString', Namespace.RDF),
    xsd_language: RdfDataType.define('language', Namespace.XSD),
    // todo add more types as needed...
  };

  public readonly shortened;
  public readonly uri;
  public readonly name;
  public readonly namespace: string;

  constructor(uri: string, name?: string, namespace?: string, commonPrefix?: string) {
    this.uri = uri;
    this.name = name;
    this.namespace = namespace;
    this.shortened = commonPrefix && name ? commonPrefix + ':' + name : uri;
  }

  public equals(dataType: RdfDataType) {
    return this.uri === dataType.uri;
  }

  public static define(name: string, namespace: Namespace) {
    return new RdfDataType(namespace.uri + name, name, namespace.uri, namespace.commonPrefix);
  }

  public static getByUri(uri: string): RdfDataType {
    const val = RdfDataType.uriToDataType[uri];

    if (!val) return new RdfDataType(uri);
    return val;
  }

  private static readonly uriToDataType = RdfDataType.populateUriToDataType();
  private static populateUriToDataType() {
    const map = {};
    Object.values(this.TYPES).forEach(val => (map[val.uri] = val));
    return map;
  }
}
