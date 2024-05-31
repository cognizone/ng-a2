import { Filter } from './filter';
import { AbstractFilter } from './abstract-filter';
import { ElasticQueryJson } from '../elastic-query-json';

export class MultiKeyFilter extends AbstractFilter {
  private filters: Filter[];

  constructor(filters: Filter[], filterKey: string) {
    super(null, null, filterKey);
    this.filters = filters;
  }

  addFilterToQuery(query: ElasticQueryJson): void {
    this.filters.forEach(filter => filter.addFilterToQuery(query));
  }

  valueIsArray() {
    return false;
  }

  public setValue(value: any) {
    this.value = value;
    this.filters.forEach(filter => filter.setValue(value));
  }

  public clearValue() {
    this.value = null;
    this.filters.forEach(filter => filter.clearValue());
  }

  public setActive(active: boolean) {
    super.setActive(active);
    this.filters.forEach(filter => filter.setActive(active));
  }
}
