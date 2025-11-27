import { MaxAggregation } from './max-aggregation';
import { ElasticQueryJson } from '../elastic-query-json';

describe('MaxAggregation', () => {
  describe('Max Aggregation', () => {
    it('should create MaxAggregation with queryKey and filterKey', () => {
      const agg = new MaxAggregation('price', 'maxPrice');
      expect(agg.key).toBe('price');
    });

    it('addAggregationToQuery should add max aggregation', () => {
      const agg = new MaxAggregation('price', 'maxPrice');
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
      expect(query.aggs['maxPrice']).toBeDefined();
      expect(query.aggs['maxPrice'].max.field).toBe('price');
    });
  });
});
