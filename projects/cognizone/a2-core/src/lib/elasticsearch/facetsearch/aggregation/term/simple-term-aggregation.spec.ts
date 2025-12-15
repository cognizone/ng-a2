import { SimpleTermAggregation } from './simple-term-aggregation';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('SimpleTermAggregation', () => {
  describe('Term Aggregation', () => {
    it('should create SimpleTermAggregation', () => {
      const agg = new SimpleTermAggregation('category', false);
      expect(agg.key).toBe('category');
    });

    it('should use keyword suffix when isKeyword is true', () => {
      const agg = new SimpleTermAggregation('category', true);
      expect(agg.getQueryKey()).toBe('category.keyword');
    });

    it('addAggregationToQuery should add term aggregation', () => {
      const agg = new SimpleTermAggregation('category', false);
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
      expect(query.aggs['category'].terms.field).toBe('category');
      expect(query.aggs['category'].terms.size).toBe(100);
    });
  });
});
