import { JsonResourceFactory } from './json-resource-factory';
import { JsonResource } from './json-resource';
import { Preconditions } from '../../../precondition/preconditions';

export abstract class JsonResourceWrapper<T extends JsonResource> {
  private _jsonRoot: any;
  protected resourceFactory: JsonResourceFactory<T>;
  private uriToResourceMap = new Map<string, T>();
  private inverseReferencesMap = new Map<string, string[]>();

  constructor(root: any, factory: JsonResourceFactory<T>) {
    Preconditions.checkNotNull(root, () => 'json root was null');
    Preconditions.checkNotNull(factory, () => 'wrapper factory was null');
    this._jsonRoot = root;
    this.resourceFactory = factory;
  }

  protected addToMap(obj: T) {
    this.uriToResourceMap.set(obj.getUri(), obj);
    obj.getAllReferences().forEach(ref => {
      const list = this.inverseReferencesMap.get(ref);
      if (!list) {
        this.inverseReferencesMap.set(ref, [obj.getUri()]);
      } else {
        //todo check for duplicates? (need to consider performance)
        this.inverseReferencesMap.get(ref).push(obj.getUri());
      }
    });
  }

  protected populateMap(): void {
    const includes = this._jsonRoot.included;
    if (!includes) {
      return;
    }
    Preconditions.checkState(includes instanceof Array);
    includes.forEach(obj => this.addToMap(this.resourceFactory(obj, this)));
  }

  public getChildren(parent: T) {
    return this.getChildrenInner(parent);
  }

  public getChildrenByReference(reference: string, parent: T, sorter?: (a: any, b: any) => number): T[] {
    const children = this.getChildrenInner(parent, reference);
    return sorter ? children.sort(sorter) : children;
  }

  private getChildrenInner(parent: T, reference?: string) {
    const child = parent.getReferences(reference);
    if (!child) {
      return [];
    } else if (child instanceof Array) {
      return child.map(uri => this.uriToResourceMap.get(uri));
    } else {
      return [this.uriToResourceMap.get(child as string)];
    }
  }

  public getParents(child: T): T[] {
    const parents = this.inverseReferencesMap.get(child.getUri());
    if (!parents) {
      return [];
    }
    return parents.map(uri => this.uriToResourceMap.get(uri));
  }

  public getParentsByReference(attribute: string, child: T): T[] {
    return this.getParents(child).filter(parent => {
      const ref = parent.getReferences(attribute);
      return !!ref && ref.includes(child.getUri());
    });
  }

  /* get one resource and extract all its references in a singe JsonTypedResourceWrapper */
  public getSingleResourceAsFullJson(resource: T): SingleJsonResourceWrapper<T> {
    const newJsonRoot = { data: resource.getRawJson(), included: [] };

    this.addAllReferences(resource, newJsonRoot.included);

    if (newJsonRoot.included.length === 0) {
      delete newJsonRoot.included;
    }

    return new SingleJsonResourceWrapper<T>(newJsonRoot, this.resourceFactory);
  }

  private addAllReferences(JsonTypedResource: JsonResource, included: any[]) {
    JsonTypedResource.getAllReferences().forEach(ref => {
      const child = this.uriToResourceMap.get(ref);
      included.push(child.getRawJson());
      this.addAllReferences(child, included);
    });
  }

  public getByUri(uri: string): T {
    return this.uriToResourceMap.get(uri);
  }

  getAll(): IterableIterator<T> {
    return this.uriToResourceMap.values();
  }

  public getAllIncluded(): T[] {
    const included = this._jsonRoot.included;
    return included ? included.map(obj => this.resourceFactory(obj, this)) : [];
  }

  public getRawJson(): any {
    return this._jsonRoot;
  }

  public addIncluded(resource: T) {
    Preconditions.checkState(!this.uriToResourceMap.has(resource.getUri()));

    const copy = this.resourceFactory(resource.getRawJson(), this);

    let includes = this._jsonRoot.included;
    if (!includes) {
      includes = this._jsonRoot.included = [];
    }

    includes.push(copy.getRawJson());
    this.addToMap(copy);
  }

  public deleteIfNotReferenced(uri: string): boolean {
    const resource = this.uriToResourceMap.get(uri);
    if (!resource) return false;
    if (this.getParents(resource).length > 0) return false;
    this.uriToResourceMap.delete(uri);

    let includes = this._jsonRoot['included'];
    for (let i = 0; i < includes.length; i++) {
      if (includes[i].uri === uri) {
        includes.splice(i, 1);
        return true;
      }
    }
    throw new Error('Inconsistent state');
  }

  public cleanupReverseReferenceMap(attribute: string, child: string, parent: string) {
    const c = this.getByUri(child);

    const parents = this.inverseReferencesMap.get(child);
    if (!parents) return;

    const remainingParents = parents
      .map(p => this.uriToResourceMap.get(p))
      .filter(p => p.getAllReferences().has(c.getUri()))
      .map(p => p.getUri());

    if (remainingParents.length == 0) {
      this.inverseReferencesMap.delete(child);
    } else {
      this.inverseReferencesMap.set(child, remainingParents);
    }
  }
}

export class SingleJsonResourceWrapper<T extends JsonResource> extends JsonResourceWrapper<T> {
  private _resourceRoot: T;

  constructor(root: any, factory: JsonResourceFactory<T>) {
    super(root, factory);

    Preconditions.checkNotNull(root.data, () => 'data was null');
    Preconditions.checkState(!(root.data instanceof Array), () => 'data was array');
    this._resourceRoot = this.resourceFactory(root.data, this);

    this.addToMap(this._resourceRoot);
    this.populateMap();
  }

  getRoot(): T {
    return this._resourceRoot;
  }
}

export class MultiJsonResourceWrapper<T extends JsonResource> extends JsonResourceWrapper<T> {
  private _resourceRoots: T[];

  constructor(root: any, factory: JsonResourceFactory<T>) {
    super(root, factory);

    Preconditions.checkNotNull(root.data, () => 'data was null');
    Preconditions.checkState(root.data instanceof Array, () => 'data was not array');
    this._resourceRoots = root.data.map(obj => this.resourceFactory(obj, this));
    this._resourceRoots.forEach(root => this.addToMap(root));
    this.populateMap();
  }

  getRoots(): T[] {
    return this._resourceRoots;
  }
}
