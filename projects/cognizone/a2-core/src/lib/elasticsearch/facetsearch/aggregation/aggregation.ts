import { ElasticQueryJson } from '../elastic-query-json';

export interface Aggregation {
  addAggregationToQuery(query: ElasticQueryJson): void;
}
