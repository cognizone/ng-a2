import { AbstractFilter } from './abstract-filter';
import { ElasticQueryJson } from '../elastic-query-json';

export class ExistsFilter extends AbstractFilter {
  public addFilterToQuery(query: ElasticQueryJson): void {
    if (this.isActive()) {
      this.getValue().forEach(val => {
        val === 'true' ? query.query.bool.must.push(this.toElasticFilter()) : query.query.bool.must_not.push(this.toElasticFilter());
      });
    }
  }

  private toElasticFilter() {
    const inner = {};
    inner['field'] = this.getQueryKey();
    const outer = {};
    outer['exists'] = inner;
    return outer;
  }

  public valueIsArray() {
    return true;
  }

  public setValue(value: any) {
    if (value instanceof Array) this.value = value;
    else this.value = [value];
  }

  public clearValue() {
    this.value = [];
  }
}
