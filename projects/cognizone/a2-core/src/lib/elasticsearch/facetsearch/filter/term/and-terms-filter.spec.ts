import { AndTermsFilter } from './and-terms-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('AndTermsFilter', () => {
  const createQuery = (): ElasticQueryJson => ({
    query: { bool: { filter: [], must: [], must_not: [], should: [] } },
    aggs: { globalAggs: { global: {}, aggs: {} } },
  });

  it('should add multiple term filters when active', () => {
    const filter = new AndTermsFilter('category', false, ['electronics', 'books']);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(2);
    expect(query.query.bool.filter[0].term.category).toBe('electronics');
    expect(query.query.bool.filter[1].term.category).toBe('books');
  });

  it('should not add filter when not active', () => {
    const filter = new AndTermsFilter('category', false);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(0);
  });

  it('should handle value operations', () => {
    const filter = new AndTermsFilter('category', false);
    filter.setValue(['electronics', 'books']);
    expect(filter.getValue()).toEqual(['electronics', 'books']);
    filter.setValue('electronics');
    expect(filter.getValue()).toEqual(['electronics']);
    filter.clearValue();
    expect(filter.getValue()).toEqual([]);
  });
});
