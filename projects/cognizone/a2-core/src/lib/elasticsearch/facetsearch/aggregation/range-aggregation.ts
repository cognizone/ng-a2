import { AbstractAggregation } from './abstract-aggregation';
import { ElasticQueryJson } from '../elastic-query-json';

export class RangeAggregation extends AbstractAggregation {
  private ranges: { to: number; from: number }[];

  constructor(key: string, ranges: { to: number; from: number }[]) {
    super(key);
    this.ranges = ranges;
  }

  addAggregationToQuery(query: ElasticQueryJson): void {
    query.aggs[this.key] = {
      range: {
        field: this.key,
        ranges: this.ranges,
      },
    };
  }
}
