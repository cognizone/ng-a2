import { ElasticSearchResult } from './elastic-search-result';

describe('ElasticSearchResult', () => {
  describe('Result Parsing', () => {
    it('emptyResult should create result with empty hits', () => {
      const result = ElasticSearchResult.emptyResult();
      expect(result.getHits()).toEqual([]);
    });

    it('should create result with hits', () => {
      const json = {
        hits: {
          total: { value: 2 },
          hits: [{ _source: { id: '1' } }, { _source: { id: '2' } }],
        },
      };
      const result = new ElasticSearchResult(json);
      expect(result.getHits().length).toBe(2);
      expect(result.getHitsTotal()).toBe(2);
    });
  });

  describe('Aggregation Buckets', () => {
    it('getBuckets should return buckets from regular aggregations', () => {
      const json = {
        hits: { hits: [] },
        aggregations: {
          category: {
            buckets: [
              { key: 'electronics', doc_count: 10 },
              { key: 'books', doc_count: 5 },
            ],
          },
        },
      };
      const result = new ElasticSearchResult(json);
      const buckets = result.getBuckets('category');
      expect(buckets.length).toBe(2);
      expect(buckets[0].value).toBe('electronics');
      expect(buckets[0].count).toBe(10);
    });

    it('getBuckets should return buckets from globalAggs', () => {
      const json = {
        hits: { hits: [] },
        aggregations: {
          globalAggs: {
            category: {
              buckets: {
                buckets: [
                  { key: 'electronics', doc_count: 10 },
                  { key: 'books', doc_count: 5 },
                ],
              },
            },
          },
        },
      };
      const result = new ElasticSearchResult(json);
      const buckets = result.getBuckets('category');
      expect(buckets.length).toBe(2);
      expect(buckets[0].value).toBe('electronics');
    });

    it('getBuckets should return empty array when no aggregations', () => {
      const json = { hits: { hits: [] } };
      const result = new ElasticSearchResult(json);
      expect(result.getBuckets('category')).toEqual([]);
    });

    it('getBuckets should use key_as_string when available', () => {
      const json = {
        hits: { hits: [] },
        aggregations: {
          dateRange: {
            buckets: [{ key: 1234567890, key_as_string: '2023-01-01', doc_count: 3 }],
          },
        },
      };
      const result = new ElasticSearchResult(json);
      const buckets = result.getBuckets('dateRange');
      expect(buckets[0].value).toBe('2023-01-01');
    });
  });
});
