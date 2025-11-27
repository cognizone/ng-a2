import { ExistsFilter } from './exists-filter';
import { ElasticQueryJson } from '../elastic-query-json';

describe('ExistsFilter', () => {
  const createQuery = (): ElasticQueryJson => ({
    query: { bool: { filter: [], must: [], must_not: [], should: [] } },
    aggs: { globalAggs: { global: {}, aggs: {} } },
  });

  it('should add to must when value is true', () => {
    const filter = new ExistsFilter('category', ['true']);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.must.length).toBe(1);
    expect(query.query.bool.must[0].exists.field).toBe('category');
  });

  it('should add to must_not when value is false', () => {
    const filter = new ExistsFilter('category', ['false']);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.must_not.length).toBe(1);
    expect(query.query.bool.must_not[0].exists.field).toBe('category');
  });

  it('should not add filter when not active', () => {
    const filter = new ExistsFilter('category');
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.must.length).toBe(0);
    expect(query.query.bool.must_not.length).toBe(0);
  });

  it('should handle value operations', () => {
    const filter = new ExistsFilter('category');
    filter.setValue(['true']);
    expect(filter.getValue()).toEqual(['true']);
    filter.setValue('false');
    expect(filter.getValue()).toEqual(['false']);
    filter.clearValue();
    expect(filter.getValue()).toEqual([]);
  });
});
