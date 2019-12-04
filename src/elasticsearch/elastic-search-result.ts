import {BasicJsonModel} from "../a2-core/attribute-model/basic-json-model";

export class  ElasticSearchResult extends BasicJsonModel {

  static emptyResult(): ElasticSearchResult {
    return new ElasticSearchResult({
      hits: {
        hits : []
      }
    })
  }

  hits: BasicJsonModel[];

  constructor(json: any) {
    super(json);

    const elasticHits = this.json['hits']['hits'];

    if (elasticHits) this.hits = this.json['hits']['hits'].map(hit => new BasicJsonModel(hit['_source']));
    else this.hits = [];
  }

  getHitsTotal(): number {
    return this.json['hits']['total']['value'];
  }

  getHits(): BasicJsonModel[] {
    return this.hits;
  }

  getBuckets(key: string): Bucket[] {
    if (!this.json['aggregations']) return [];

    if (this.json['aggregations'][key]) {
      return this.json['aggregations'][key]['buckets']
        .map(rawBucket => this.elasticBucketToBucket(rawBucket));
    }
    else if (this.json['aggregations']['globalAggs'][key]) {
      return this.json['aggregations']['globalAggs'][key]['buckets']['buckets']
        .map(rawBucket => this.elasticBucketToBucket(rawBucket));
    }
    else return [];
  }

  private elasticBucketToBucket(elasticBucket: any): Bucket {
    return {
      count: elasticBucket['doc_count'],
      value: elasticBucket['key_as_string'] ? elasticBucket['key_as_string'] : elasticBucket['key']
    };
  }
}

export interface Bucket {
  value: string;
  count: number;
}
