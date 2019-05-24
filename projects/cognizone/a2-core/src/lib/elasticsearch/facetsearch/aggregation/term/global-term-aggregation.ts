import { ElasticQueryJson } from '../../elastic-query-json';
import { AbstractTermAggregation } from './abstract-term-aggregation';

export class GlobalTermAggregation extends AbstractTermAggregation {
  public addAggregationToQuery(query: ElasticQueryJson): void {
    const globalAgg = {
      aggs: { buckets: { terms: { field: this.getQueryKey(), size: 100 } } },
      filter: { bool: { filter: [], must: [] } },
    };

    query.aggs.globalAggs.aggs[this.key] = globalAgg;

    query.query.bool.filter.filter(f => this.elasticFilterIsSelf(f)).forEach(f => globalAgg.filter.bool.filter.push(f));

    query.query.bool.must.filter(f => this.elasticFilterIsSelf(f)).forEach(f => globalAgg.filter.bool.must.push(f));
  }

  private elasticFilterIsSelf(elasticFilter: any) {
    return (
      (elasticFilter['terms'] == null || elasticFilter['terms'][this.getQueryKey()] == null) &&
      (elasticFilter['term'] == null || elasticFilter['term'][this.getQueryKey()] == null)
    );
  }
}
