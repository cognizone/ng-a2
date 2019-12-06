import {ElasticQueryJson} from '../../elastic-query-json';
import {MatchFilter} from './match-filter';

export class MatchFilterMust extends MatchFilter {

  public addFilterToQuery (query: ElasticQueryJson): void {
    if (this.isActive()) query.query.bool.must.push(this.toElasticFilter());
  }

}
