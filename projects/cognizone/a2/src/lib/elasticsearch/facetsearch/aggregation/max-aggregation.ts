import {AbstractAggregation} from './abstract-aggregation';
import {ElasticQueryJson} from '../elastic-query-json';

export class MaxAggregation extends AbstractAggregation {

  private filterKey: string;

  constructor(queryKey: string, filterKey: string) {
    super(queryKey);
    this.filterKey = filterKey;
  }

  addAggregationToQuery(query: ElasticQueryJson): void {
    query.aggs[this.filterKey] = {max: {field: this.key}}
  }
}
