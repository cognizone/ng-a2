import {Aggregation} from './aggregation';
import {ElasticQueryJson} from '../elastic-query-json';

export abstract class AbstractAggregation implements Aggregation{
  private _key: string;

  constructor(key: string) {
    this._key = key;
  }

  get key(): string {
    return this._key;
  }

  public abstract addAggregationToQuery(query: ElasticQueryJson): void
}
