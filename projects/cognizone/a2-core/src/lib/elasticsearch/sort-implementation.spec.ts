import { SortBuilder } from './sort-implementation';
import { ParamMap } from '@angular/router';

describe('Sort', () => {
  describe('Sort Management', () => {
    it('should create sort with builder', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true).addSortField('date', false, false, false).get();

      expect(sort.getEnabled('name')).toBe(true);
      expect(sort.getAscending('name')).toBe(false); // defaults to false
      sort.setAscending('name', true);
      expect(sort.getAscending('name')).toBe(true);
      expect(sort.getEnabled('date')).toBe(false);
    });

    it('should set and get ascending for enabled field', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, false).get();
      sort.setAscending('name', true);
      expect(sort.getAscending('name')).toBe(true);
    });

    it('should enable and disable sort fields', () => {
      const sort = SortBuilder.builder().addSortField('name', false, false, false).get();
      sort.setEnabled('name', true);
      expect(sort.getEnabled('name')).toBe(true);
      sort.setEnabled('name', false);
      expect(sort.getEnabled('name')).toBe(false);
    });

    it('toElasticQuerySort should return correct format', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true).addSortField('date', true, false, false).get();

      sort.setAscending('name', true);
      const querySort = sort.toElasticQuerySort();
      expect(querySort['name']).toEqual({ order: 'asc', missing: '_last' });
    });

    it('toElasticQuerySort should include keyword suffix when keyword is true', () => {
      const sort = SortBuilder.builder().addSortField('name', true, true, true).get();
      sort.setAscending('name', true);
      const querySort = sort.toElasticQuerySort();
      expect(querySort['name.keyword']).toEqual({ order: 'asc', missing: '_last' });
    });

    it('toElasticQuerySort should handle missingFirst option', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true, true).get();
      sort.setAscending('name', true);
      const querySort = sort.toElasticQuerySort();
      expect(querySort['name']).toEqual({ order: 'asc', missing: '_first' });
    });

    it('addToQueryParams should add sort to params', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true).get();
      const params: any = {};
      sort.addToQueryParams(params);
      expect(params['sort']).toBe('name');
    });

    it('setFromQueryParams should set sort from params', () => {
      const sort = SortBuilder.builder().addSortField('name', false, false, false).get();
      const params = {
        get: (key: string) => (key === 'sort' ? 'name' : null),
        getAll: () => [],
        keys: [],
        has: () => false,
      } as ParamMap;

      sort.setFromQueryParams(params);
      expect(sort.getEnabled('name')).toBe(true);
    });

    it('getPriorityQueue should return enabled fields', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true).addSortField('date', false, false, false).get();

      const queue = sort.getPriorityQueue();
      expect(queue).toContain('name');
      expect(queue).not.toContain('date');
    });

    it('disable should clear active sort', () => {
      const sort = SortBuilder.builder().addSortField('name', false, true, true).get();
      sort.disable();
      expect(sort.getEnabled('name')).toBe(false);
    });
  });
});
