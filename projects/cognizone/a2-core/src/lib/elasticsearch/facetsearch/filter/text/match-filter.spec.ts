import { MatchFilter } from './match-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

describe('MatchFilter', () => {
  const createQuery = (): ElasticQueryJson => ({
    query: { bool: { filter: [], must: [], must_not: [], should: [] } },
    aggs: { globalAggs: { global: {}, aggs: {} } },
  });

  it('should add match filter to should when active', () => {
    const filter = new MatchFilter('title', 'search term', undefined, 2.0);
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.should.length).toBe(1);
    expect(query.query.bool.should[0].match.title.query).toBe('search term');
    expect(query.query.bool.should[0].match.title.boost).toBe(2.0);
  });

  it('should not add filter when not active', () => {
    const filter = new MatchFilter('title');
    const query = createQuery();

    filter.addFilterToQuery(query);
    expect(query.query.bool.should.length).toBe(0);
  });

  it('should handle value operations', () => {
    const filter = new MatchFilter('title');
    filter.setValue('search term');
    expect(filter.getValue()).toBe('search term');
    filter.clearValue();
    expect(filter.getValue()).toBeNull();
  });
});
