import {ElasticQueryJson} from '../../elastic-query-json';
import {AbstractTermFilter} from './abstract-term-filter';

export class OrTermsFilter extends AbstractTermFilter {

  public addFilterToQuery (query: ElasticQueryJson):void {
    if (this.isActive()) query.query.bool.filter.push(this.toElasticFilter());
  }

  private toElasticFilter() {
    const inner = {};
    inner[this.getQueryKey()] = this.getValue();
    const outer = {};
    outer['terms'] = inner;

    return outer;

  }

  public valueIsArray() {
    return true;
  }

  public setValue(value: any) {
    if (!value) this.clearValue();
    else if (value instanceof Array) this.value = value;
    else this.value = [value];
  }

  public clearValue() {
    this.value = [];
  }
}
