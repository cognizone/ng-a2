import {ApplicationProfile, Attribute, Type} from './application-profile';
import {RdfDataType} from '../rdf/rdf-data-type';
import {Preconditions} from "../../precondition/preconditions";

export class ApplicationProfileBuilder {
  constructor(private _json: any) {}

  get(): ApplicationProfile {
    const uri = this._json.uri;
    this.validateNotNull(uri, () => 'uri');

    this.validateNotNull(this._json, () => 'json');
    this.validateNotNull(this._json.types, () => 'types');
    this.validateState(this._json.types instanceof Object, () => 'types was not object');
    const types = new Map<string, Type>();

    const ap = new ApplicationProfile(uri, types);

    Object.entries(this._json.types)
        .forEach(([key, value]) => types.set(key, this.buildType(ap, key, value)));

    return ap;
  }

  private buildType(profile: ApplicationProfile, key: string, json: any): Type {
    const typeNameMsg = () => 'type "' + key + '"';

    this.validateNotNull(json, typeNameMsg);

    this.validateNotNull(json.attributes, () => typeNameMsg() + ' - attributes');
    const attributes = new Map<string, Attribute>();

    const type = new Type(profile, [key], attributes);

    Object.entries(json.attributes)
        .forEach(([key, value]) => attributes.set(key, this.buildAttribute(type, key, value, key)));

    return type;
  }

  private buildAttribute(type: Type, key: string, json: any, classId: string): Attribute {
    const attributeNameMsg = () =>
        'type "' + classId + '", attribute "' + key + '" ';
    this.validateNotNull(json, attributeNameMsg);

    const uri = json.uri;
    this.validateNotNull(uri, () => attributeNameMsg() + 'uri');

    const attributeId = json.attributeId;
    this.validateNotNull(attributeId, () => attributeNameMsg() + ' - attributeId');

    const rules = json.rules;
    this.validateNotNull(rules, () => attributeNameMsg() + 'rules');
    this.validateState(rules instanceof Array, () => attributeNameMsg() + 'rules was not array');

    let minC: number;
    let maxC: number;
    let dataType: RdfDataType;
    let rangeClassId: string;

    rules.forEach(rule => {
      const name: RuleName = rule.name;

      this.validateNotNull(name, () => attributeNameMsg() + ' rule name');

      if (name === RuleName.minCardinality) {
        this.validateState(minC == null, () => attributeNameMsg() + 'rule "' + name + '" was defined twice ');
        minC = rule.value;
        this.validateNotNull(minC, () => attributeNameMsg() + name);
      }
      else if (name === RuleName.maxCardinality) {
        this.validateState(maxC == null, () => attributeNameMsg() + 'rule "' + name + '" was defined twice ');
        maxC = rule.value;
        this.validateNotNull(maxC, () => attributeNameMsg() + name);
      }
      else if (name === RuleName.range) {
        const val = rule.value;
        this.validateNotNull(val, () => attributeNameMsg() + name + ' value');
        const valName = val.name;
        this.validateNotNull(valName, () => attributeNameMsg() + name + 'value name');

        const valValue = val.value;
        this.validateNotNull(valValue, () => attributeNameMsg() + name + 'value value');

        if (valName === 'classId') {
          rangeClassId = valValue;
          dataType = RdfDataType.TYPES.rdfs_Resource;
        }
        else if (valName === 'datatype')
          dataType = RdfDataType.getByUri(valValue);
        else throw new Error('Unknown range name ' + valName);
      }
    });
    this.validateState(
      rules.some(rule => rule.name === RuleName.snippet) || dataType != null || rangeClassId != null,
      () => attributeNameMsg() + ' range was not defined');
    return new Attribute(type, uri, attributeId, dataType, maxC, minC, rangeClassId);
  }

  private validateNotNull(thing: any, name = () => 'object'): void {
    Preconditions.checkNotNull(thing, () => 'Fail build AP: ' + name() + '" was null');
  }

  private validateState(state: boolean, msg = () => 'illegal state') {
    Preconditions.checkState(state, () => 'Fail build AP: ' + msg());
  }
}

enum RuleName {
  snippet = 'snippet',
  range = 'range',
  minCardinality = 'minCardinality',
  maxCardinality = 'maxCardinality'
}
