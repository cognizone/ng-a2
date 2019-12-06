import {AbstractFilter} from '../abstract-filter';

export abstract class AbstractTermFilter extends AbstractFilter {

  private _isKeyword: boolean;

  constructor(queryKey: string, isKeyword = false, value?: any, filterKey?: string) {
    super(queryKey, value, filterKey);
    this._isKeyword = isKeyword;
  }

  getQueryKey(): string {
    return this._isKeyword ? super.getQueryKey() + '.keyword' : super.getQueryKey();
  }
}
