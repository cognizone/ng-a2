import {AttributeModel} from './attribute-model';
import {Preconditions} from "../../precondition/preconditions";

export class BasicJsonModel implements AttributeModel {
  private _json: Object;

  constructor (json: Object) {
    Preconditions.checkNotNull(json);
    this._json = json;
  }

  getValue(key: string) {
    return this._json[key];
  }

  setValue(key: string, value: any) {
    this._json[key] = value;
  }

  clearValue(key: string) {
    delete this._json[key];
  }

  getAttributeIds(): string[] {
    if (this._json == null) return [];
    return Object.keys(this._json);
  }

  get json(): Object {
    return this._json;
  }

  set json(value: Object) {
    this._json = value;
  }

  getUri(): string {
    return 'json';
  }

  public getObjectsByAttributeTrail (trail: string[], filters?: {key: string, value: any}[]): BasicJsonModel[] {
    Preconditions.checkState(trail instanceof Array, () => 'trail must be array');
    if (filters) Preconditions.checkState(filters instanceof Array, () => 'filters must be array');

    let objects: BasicJsonModel[] = [this];
    trail.forEach
    (
      p => objects = objects
        .map(obj => this.getChildObjectsOfProperty(obj, p)).
        reduce((a, b) => a.concat(b), [])
    );

    if (filters) filters.forEach
    (
      filter => objects = objects
        .filter(obj => obj.getValue(filter.key) === filter.value)
    );
    return objects;
  }

  public getOneObjectByAttributeTrail (trail: string[], filters?: {key: string, value: any}[]): BasicJsonModel {
    const objects = this.getObjectsByAttributeTrail(trail, filters);
    if (objects.length === 0) return null;
    Preconditions.checkState(objects.length === 1, () => 'found more than one object');
    return objects[0];
  }

  public getChildObjectsOfProperty (parent: BasicJsonModel, property: string): BasicJsonModel[] {

    const children = parent.getValue(property);

    if (children instanceof Array) return children.map(child => new BasicJsonModel(child));
    else if (children instanceof Object) return [new BasicJsonModel(children)];

    throw new Error('Could not find children');
  }

  public getOneChildObjectOfProperty (parent: BasicJsonModel, property: string): BasicJsonModel {
    const objects = this.getChildObjectsOfProperty(parent, property);
    if (objects.length === 0) return null;
    Preconditions.checkState(objects.length === 1, () => 'found more than one object');
    return objects[0];
  }

  public getDeepCopy(): BasicJsonModel {
    return new BasicJsonModel(JSON.parse(JSON.stringify(this._json)));
  }

  public clear(): void {
    this._json = {};
  }
}
