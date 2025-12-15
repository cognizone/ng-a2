import { TermFilter } from './term-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('TermFilter', () => {
  const createQuery = (): ElasticQueryJson => ({
    query: { bool: { filter: [], must: [], must_not: [], should: [] } },
    aggs: { globalAggs: { global: {}, aggs: {} } },
  });

  it('should add term filter when active', () => {
    const filter = new TermFilter('category', false, 'electronics');
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(1);
    expect(query.query.bool.filter[0].term.category).toBe('electronics');
  });

  it('should not add filter when not active', () => {
    const filter = new TermFilter('category', false);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.filter.length).toBe(0);
  });

  it('should use keyword suffix when isKeyword is true', () => {
    const filter = new TermFilter('category', true, 'electronics');
    expect(filter.getQueryKey()).toBe('category.keyword');
  });

  it('should handle value operations', () => {
    const filter = new TermFilter('category', false);
    filter.setValue('electronics');
    expect(filter.getValue()).toBe('electronics');
    filter.clearValue();
    expect(filter.getValue()).toBeNull();
  });
});
