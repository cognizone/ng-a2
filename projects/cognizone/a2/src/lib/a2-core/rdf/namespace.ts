export class Namespace {
  public static readonly RDF = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf');
  public static readonly RDFS = new Namespace('http://www.w3.org/2000/01/rdf-schema#', 'rdfs');
  public static readonly XSD = new Namespace('http://www.w3.org/2001/XMLSchema#', 'xsd');
  // todo add more namespaces as needed...

  constructor(
    private readonly _uri: string,
    private readonly _commonPrefix
  ) {}

  get uri(): string {
    return this._uri;
  }

  get commonPrefix() {
    return this._commonPrefix;
  }
}
