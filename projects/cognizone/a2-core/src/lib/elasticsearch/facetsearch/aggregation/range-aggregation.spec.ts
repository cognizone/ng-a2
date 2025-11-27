import { RangeAggregation } from './range-aggregation';
import { ElasticQueryJson } from '../elastic-query-json';

describe('RangeAggregation', () => {
  describe('Range Aggregation', () => {
    it('should create RangeAggregation with ranges', () => {
      const ranges = [
        { from: 0, to: 100 },
        { from: 100, to: 200 },
      ];
      const agg = new RangeAggregation('price', ranges);
      expect(agg.key).toBe('price');
    });

    it('addAggregationToQuery should add range aggregation', () => {
      const ranges = [
        { from: 0, to: 100 },
        { from: 100, to: 200 },
      ];
      const agg = new RangeAggregation('price', ranges);
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
      expect(query.aggs['price']).toBeDefined();
      expect(query.aggs['price'].range.field).toBe('price');
      expect(query.aggs['price'].range.ranges).toEqual(ranges);
    });
  });
});
