import {AbstractAggregation} from '../abstract-aggregation';

export abstract class AbstractTermAggregation extends AbstractAggregation{

  private _isKeyword: boolean;

  constructor(key: string, isKeyword = false) {
    super(key);
    this._isKeyword = isKeyword;
  }

  getQueryKey(): string {
    return this._isKeyword ? this.key + '.keyword' : this.key;
  }
}
