import { OrTermsFilter } from './or-terms-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('OrTermsFilter', () => {
  const createQuery = (): ElasticQueryJson => ({
    query: { bool: { filter: [], must: [], must_not: [], should: [] } },
    aggs: { globalAggs: { global: {}, aggs: {} } },
  });

  it('should add terms filter when active', () => {
    const filter = new OrTermsFilter('category', false, ['electronics', 'books']);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(1);
    expect(query.query.bool.filter[0].terms.category).toEqual(['electronics', 'books']);
  });

  it('should not add filter when not active', () => {
    const filter = new OrTermsFilter('category', false);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(0);
  });

  it('should handle value operations', () => {
    const filter = new OrTermsFilter('category', false);
    filter.setValue(['electronics', 'books']);
    expect(filter.getValue()).toEqual(['electronics', 'books']);
    filter.setValue('electronics');
    expect(filter.getValue()).toEqual(['electronics']);
    filter.clearValue();
    expect(filter.getValue()).toEqual([]);
  });
});
