import { FacetSearch, SearchFilterBuilder } from './facet-search';
import { TermFilter } from './filter/term/term-filter';
import { SimpleTermAggregation } from './aggregation/term/simple-term-aggregation';
import { ElasticQueryJson } from './elastic-query-json';
import { ParamMap } from '@angular/router';

describe('FacetSearch', () => {
  describe('Facet Search Management', () => {
    it('should create FacetSearch with builder', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false, 'electronics'));
      builder.addAggregation(new SimpleTermAggregation('category', false));
      const search = builder.get();

      expect(search).toBeDefined();
      expect(search.getFilters().length).toBe(1);
    });

    it('getValue and setValue should work with filters', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false));
      const search = builder.get();

      search.setValue('category', 'electronics');
      expect(search.getValue('category')).toBe('electronics');
    });

    it('clearValue should clear filter value', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false, 'electronics'));
      const search = builder.get();

      search.clearValue('category');
      expect(search.isActiveFilter('category')).toBe(false);
    });

    it('toElasticQuery should generate correct query structure', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false, 'electronics'));
      builder.addAggregation(new SimpleTermAggregation('category', false));
      const search = builder.get();

      const query = search.toElasticQuery();
      expect(query.query.bool.filter).toBeDefined();
      expect(query.aggs).toBeDefined();
    });

    it('toElasticQuery should include aggregations when withAggs is true', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false));
      builder.addAggregation(new SimpleTermAggregation('category', false));
      const search = builder.get();

      const query = search.toElasticQuery(true);
      expect(query.aggs['category']).toBeDefined();
    });

    it('toElasticQuery should exclude aggregations when withAggs is false', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false));
      builder.addAggregation(new SimpleTermAggregation('category', false));
      const search = builder.get();

      const query = search.toElasticQuery(false);
      expect(query.aggs.globalAggs.aggs).toEqual({});
    });

    it('addToQueryParams should add active filters to params', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false, 'electronics'));
      const search = builder.get();

      const params: any = {};
      search.addToQueryParams(params);
      expect(params['category']).toBe('electronics');
    });

    it('setFromQueryParams should set filters from params', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false));
      const search = builder.get();

      const params = {
        get: (key: string) => (key === 'category' ? 'electronics' : null),
        getAll: (key: string) => [],
        keys: ['category'],
        has: (key: string) => key === 'category',
      } as ParamMap;

      search.setFromQueryParams(params);
      expect(search.getValue('category')).toBe('electronics');
    });

    it('getPropertyKeys should return only active filter keys', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false, 'electronics'));
      builder.addFilter(new TermFilter('type', false));
      const search = builder.get();

      const keys = search.getPropertyKeys();
      expect(keys).toContain('category');
      expect(keys).not.toContain('type');
    });
  });

  describe('Search Filter Builder', () => {
    it('should build FacetSearch with filters and aggregations', () => {
      const builder = FacetSearch.builder();
      builder.addFilter(new TermFilter('category', false));
      builder.addAggregation(new SimpleTermAggregation('category', false));
      const search = builder.get();

      expect(search.getFilters().length).toBe(1);
    });

    it('addFixedFilter should require non-null value', () => {
      const builder = FacetSearch.builder();
      expect(() => builder.addFixedFilter(new TermFilter('category', false))).toThrow();
    });

    it('addAndTermsFacet should add filter and aggregation', () => {
      const builder = FacetSearch.builder();
      builder.addAndTermsFacet('category', false, ['electronics', 'books']);
      const search = builder.get();

      expect(search.getFilters().length).toBe(1);
      const query = search.toElasticQuery();
      expect(query.aggs['category']).toBeDefined();
    });

    it('addOrTermsFacet should add filter and global aggregation', () => {
      const builder = FacetSearch.builder();
      builder.addOrTermsFacet('category', false, ['electronics']);
      const search = builder.get();

      expect(search.getFilters().length).toBe(1);
      const query = search.toElasticQuery();
      expect(query.aggs.globalAggs.aggs['category']).toBeDefined();
    });
  });
});
