export interface ElasticQueryJson {
  query: {
    bool: {
      filter: any[],
      must: any[],
      must_not: any[],
      should: any[]
    }
  },
  aggs: {
    globalAggs: {
      global: {},
      aggs: {}
    }
  },
}
