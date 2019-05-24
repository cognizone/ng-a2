import { AbstractFilter } from '../abstract-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

export class MultiMatchFilter extends AbstractFilter {
  boost: number;
  type: string;
  protected queryKeys: string[];

  constructor(
    queryKeys: string[],
    filterKey?: string,
    type?: 'best_fields' | 'most_fields' | 'cross_fields' | 'phrase' | 'phrase_prefix',
    boost: number = 1,
    value?: any
  ) {
    super(null, value, filterKey);

    this.boost = boost;
    this.type = type;
    this.queryKeys = queryKeys;
  }

  public addFilterToQuery(query: ElasticQueryJson): void {
    if (this.isActive()) query.query.bool.must.push(this.toElasticFilter());
  }

  protected toElasticFilter() {
    const inner = { query: this.getValue(), fields: this.queryKeys, fuzziness: 'auto', boost: this.boost };
    if (this.type) inner['type'] = this.type;
    const outer = { multi_match: null };
    outer.multi_match = inner;
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
