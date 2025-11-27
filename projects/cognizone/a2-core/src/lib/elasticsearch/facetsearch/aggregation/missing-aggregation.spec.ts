import { MissingAggregation } from './missing-aggregation';
import { ElasticQueryJson } from '../elastic-query-json';

describe('MissingAggregation', () => {
  describe('Missing Aggregation', () => {
    it('should create MissingAggregation', () => {
      const agg = new MissingAggregation('category');
      expect(agg.key).toBe('category');
    });

    it('addAggregationToQuery should add missing aggregation', () => {
      const agg = new MissingAggregation('category');
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
      expect(query.aggs['category']).toBeDefined();
      expect(query.aggs['category'].missing.field).toBe('category');
    });
  });
});
