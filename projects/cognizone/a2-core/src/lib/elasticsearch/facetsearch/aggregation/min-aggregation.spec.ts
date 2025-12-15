import { MinAggregation } from './min-aggregation';
import { ElasticQueryJson } from '../elastic-query-json';

describe('MinAggregation', () => {
  describe('Min Aggregation', () => {
    it('should create MinAggregation with queryKey and filterKey', () => {
      const agg = new MinAggregation('price', 'minPrice');
      expect(agg.key).toBe('price');
    });

    it('addAggregationToQuery should add min aggregation', () => {
      const agg = new MinAggregation('price', 'minPrice');
      const query: ElasticQueryJson = {
        query: {
          bool: {
            filter: [],
            must: [],
            must_not: [],
            should: [],
          },
        },
        aggs: {
          globalAggs: {
            global: {},
            aggs: {},
          },
        },
      };

      agg.addAggregationToQuery(query);
      expect(query.aggs['minPrice']).toBeDefined();
      expect(query.aggs['minPrice'].min.field).toBe('price');
    });
  });
});
