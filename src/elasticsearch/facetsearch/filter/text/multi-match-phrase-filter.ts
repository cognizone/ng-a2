import {MultiMatchFilter} from './multi-match-filter';

export class MultiMatchPhraseFilter extends MultiMatchFilter {

  protected toElasticFilter() {
    const inner = {query: this.getValue(), fields: this.queryKeys, boost: this.boost, type: 'phrase'};
    const outer = {multi_match : null};
    outer.multi_match = inner;
    return outer;
  }

}
