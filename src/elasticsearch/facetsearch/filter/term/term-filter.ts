import {ElasticQueryJson} from '../../elastic-query-json';
import {AbstractTermFilter} from './abstract-term-filter';

export class TermFilter extends AbstractTermFilter {

  public addFilterToQuery (query: ElasticQueryJson): void {
    if (this.isActive()) query.query.bool.filter.push(this.toElasticFilter());
  }

  protected toElasticFilter() {
    const inner = {};
    inner[this.getQueryKey()] = this.getValue();
    const outer = {};
    outer['term'] = inner;
    return outer;
  }

 public valueIsArray() {
    return false;
  }

  clearValue() {
    this.value = null;
  }

  setValue(value: any) {
    this.value = value;
  }

}

