import { ElasticQueryJson } from '../../elastic-query-json';
import { AbstractTermFilter } from './abstract-term-filter';

export class AndTermsFilter extends AbstractTermFilter {
  public addFilterToQuery(query: ElasticQueryJson): void {
    if (this.isActive()) {
      this.getValue().forEach(val => {
        query.query.bool.filter.push(this.toElasticFilter(val));
      });
    }
  }

  private toElasticFilter(val: string) {
    const inner = {};
    inner[this.getQueryKey()] = val;
    const outer = {};
    outer['term'] = inner;

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
