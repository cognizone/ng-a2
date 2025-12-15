import { RangeFilter } from './range-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('RangeFilter', () => {
  let filter: RangeFilter;
  let query: ElasticQueryJson;

  beforeEach(() => {
    filter = new RangeFilter('price', 'priceFilter', 'gte', 100);
    query = {
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
  });

  describe('Numeric Range Filtering', () => {
    it('should create with rangeType and value', () => {
      expect(filter.rangeType).toBe('gte');
      expect(filter.getValue()).toBe(100);
    });

    it('addFilterToQuery should add filter when active', () => {
      filter.addFilterToQuery(query);
      expect(query.query.bool.filter.length).toBe(1);
      expect(query.query.bool.filter[0].range.price.gte).toBe(100);
    });

    it('should not add filter when not active', () => {
      const inactiveFilter = new RangeFilter('price', 'priceFilter', 'gte');
      inactiveFilter.addFilterToQuery(query);
      expect(query.query.bool.filter.length).toBe(0);
    });

    it('setValue and clearValue should work', () => {
      filter.setValue(200);
      expect(filter.getValue()).toBe(200);
      filter.clearValue();
      expect(filter.getValue()).toBeNull();
    });
  });
});
