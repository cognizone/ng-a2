import {Filter} from './filter';
import {AbstractFilter} from './abstract-filter';
import {ElasticQueryJson} from '../elastic-query-json';

export class MultiValueFilter extends AbstractFilter {

  private innerFilter: Filter;

  constructor (innerFilter: Filter) {
    super(null, null, innerFilter.getFilterKey());
    this.innerFilter = innerFilter;
    this.innerFilter.setActive(true);
  }

  addFilterToQuery(query: ElasticQueryJson): void {
    if (!this.isActive()) return;
    (<any[]>this.getValue()).forEach(value => {
      this.innerFilter.setValue(value);
      this.innerFilter.addFilterToQuery(query);
    });
  }

  valueIsArray() {
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
