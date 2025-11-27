import { GlobalTermAggregation } from './global-term-aggregation';
import { ElasticQueryJson } from '../../elastic-query-json';
import { TermFilter } from '../../filter/term/term-filter';

describe('GlobalTermAggregation', () => {
  describe('Global Term Aggregation', () => {
    it('should create GlobalTermAggregation', () => {
      const agg = new GlobalTermAggregation('category', false);
      expect(agg.key).toBe('category');
    });

    it('should use keyword suffix when isKeyword is true', () => {
      const agg = new GlobalTermAggregation('category', true);
      expect(agg.getQueryKey()).toBe('category.keyword');
    });

    it('addAggregationToQuery should add global aggregation', () => {
      const agg = new GlobalTermAggregation('category', false);
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
      expect(query.aggs.globalAggs.aggs['category']).toBeDefined();
      expect(query.aggs.globalAggs.aggs['category'].aggs.buckets.terms.field).toBe('category');
    });

    it('addAggregationToQuery should exclude self filters from global aggregation', () => {
      const agg = new GlobalTermAggregation('category', false);
      const query: ElasticQueryJson = {
        query: {
          bool: {
            filter: [{ term: { category: 'electronics' } }, { term: { type: 'book' } }],
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
      const globalFilter = query.aggs.globalAggs.aggs['category'].filter.bool.filter;
      expect(globalFilter.length).toBe(1);
      expect(globalFilter[0].term.type).toBe('book');
    });
  });
});
