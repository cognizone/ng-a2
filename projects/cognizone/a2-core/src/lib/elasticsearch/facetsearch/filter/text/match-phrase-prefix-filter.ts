import { AbstractFilter } from '../abstract-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

export class MatchPhrasePrefixFilter extends AbstractFilter {
  boost: number;

  constructor(queryKey: string, value?: any, filterKey?: string, boost: number = 1) {
    super(queryKey, value, filterKey);

    this.boost = boost;
  }

  public addFilterToQuery(query: ElasticQueryJson): void {
    if (this.isActive()) query.query.bool.should.push(this.toElasticFilter());
  }

  private toElasticFilter() {
    const inner = { query: this.getValue(), boost: this.boost };
    const outer = { match_phrase_prefix: {} };
    outer.match_phrase_prefix[this.getQueryKey()] = inner;
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
