import { ElasticQueryJson } from '../elastic-query-json';
import { AbstractAggregation } from './abstract-aggregation';

export class MissingAggregation extends AbstractAggregation {
  public addAggregationToQuery(query: ElasticQueryJson): void {
    query.aggs[this.key] = { missing: { field: this.key } };
  }
}
