import { ElasticQueryJson } from '../../elastic-query-json';
import { AbstractTermAggregation } from './abstract-term-aggregation';

export class SimpleTermAggregation extends AbstractTermAggregation {
  public addAggregationToQuery(query: ElasticQueryJson): void {
    query.aggs[this.key] = { terms: { field: this.getQueryKey(), size: 100 } };
  }
}
