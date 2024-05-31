import { ParamMap } from '@angular/router';
import { isNumber } from 'util';
import { ElasticQueryJson } from './elastic-query-json';
import { SimpleTermAggregation } from './aggregation/term/simple-term-aggregation';
import { GlobalTermAggregation } from './aggregation/term/global-term-aggregation';
import { Filter } from './filter/filter';
import { TermFilter } from './filter/term/term-filter';
import { Aggregation } from './aggregation/aggregation';
import { OrTermsFilter } from './filter/term/or-terms-filter';
import { AndTermsFilter } from './filter/term/and-terms-filter';
import { AttributeModel } from '../../a2-core/attribute-model/attribute-model';
import { Preconditions } from '../../precondition/preconditions';

export class FacetSearch implements AttributeModel {
  constructor(filters: Map<string, Filter>, fixedFilters: Map<string, Filter>, aggregations: Aggregation[]) {
    this.filters = filters;
    this.filterList = [];
    filters.forEach(value => this.filterList.push(value));
    this.fixedFilters = fixedFilters;
    this.fixedFilters.forEach(filter => filter.setActive(true));

    this.aggregations = aggregations;
  }

  private fixedFilters: Map<string, Filter>;
  private filters: Map<string, Filter>;
  private filterList: Filter[];
  private aggregations: Aggregation[];

  static builder() {
    return new SearchFilterBuilder();
  }

  getValue(key: string) {
    return this.filters.get(key).getValue();
  }

  setValue(key: string, value: any) {
    this.filters.get(key).setValue(value);
    this.filters.get(key).setActive((value != null && value.length > 0) || isNumber(value));
  }

  clearValue(key: string) {
    const filter = this.filters.get(key);
    filter.setActive(false);
    filter.clearValue();
  }

  getUri(): string {
    return 'filter';
  }

  setFromQueryParams(params: ParamMap) {
    this.filters.forEach(filter => {
      filter.setActive(false);
      filter.clearValue();
    });

    params.keys.forEach(k => {
      const filter = this.filters.get(k);
      if (!filter) return;

      if (filter.valueIsArray()) {
        this.setValue(k, params.getAll(k));
      } else {
        this.setValue(k, params.get(k));
      }
    });
  }

  isActiveFilter(key: string) {
    return this.filters.get(key).isActive();
  }

  isPropertyObject(key: string) {
    return true;
  }

  isPropertyArray(key: string) {
    return false;
  }

  getPropertyKeys(): string[] {
    return Array.from(this.filters.keys()).filter(key => this.filters.get(key).isActive());
  }

  getFilters(): Filter[] {
    return this.filterList;
  }

  toElasticQuery(withAggs = true): any {
    const query: ElasticQueryJson = {
      query: {
        bool: {
          filter: [],
          must: [],
          must_not: [],
          should: [],
        },
      },
      aggs: {
        globalAggs: {
          global: {},
          aggs: {},
        },
      },
    };

    this.filters.forEach(filter => filter.addFilterToQuery(query));
    this.fixedFilters.forEach(filter => filter.addFilterToQuery(query));

    if (withAggs) this.aggregations.forEach(filter => filter.addAggregationToQuery(query));

    return query;
  }

  addToQueryParams(params: Object) {
    this.filters.forEach((value, key) => {
      if (value.isActive()) params[key] = value.getValue();
    });
  }
}

export class SearchFilterBuilder {
  private filters = new Map<string, Filter>();
  private fixedFilters = new Map<string, Filter>();
  private aggregations: Aggregation[] = [];

  addFilter(filter: Filter): SearchFilterBuilder {
    this.filters.set(filter.getFilterKey(), filter);
    return this;
  }

  addFixedFilter(filter: Filter): SearchFilterBuilder {
    Preconditions.checkNotNull(filter.getValue());
    this.fixedFilters.set(filter.getFilterKey(), filter);
    return this;
  }

  addAggregation(agg: Aggregation): SearchFilterBuilder {
    this.aggregations.push(agg);
    return this;
  }

  addAndTermsFacet(key: string, isKeyword = false, value?: Array<any>) {
    this.filters.set(key, new AndTermsFilter(key, isKeyword, value ? value : []));
    this.aggregations.push(new SimpleTermAggregation(key, isKeyword));
    return this;
  }

  addAndTermFacet(key: string, isKeyword = false, value?: any): SearchFilterBuilder {
    this.filters.set(key, new TermFilter(key, isKeyword, value));
    this.aggregations.push(new SimpleTermAggregation(key, isKeyword));
    return this;
  }

  addOrTermFacet(key: string, isKeyword = false, value?: any): SearchFilterBuilder {
    this.filters.set(key, new TermFilter(key, isKeyword, value));
    this.aggregations.push(new GlobalTermAggregation(key, isKeyword));
    return this;
  }

  addOrTermsFacet(key: string, isKeyword = false, value?: Array<any>): SearchFilterBuilder {
    this.filters.set(key, new OrTermsFilter(key, isKeyword, value ? value : []));
    this.aggregations.push(new GlobalTermAggregation(key, isKeyword));
    return this;
  }

  get(): FacetSearch {
    return new FacetSearch(this.filters, this.fixedFilters, this.aggregations);
  }

  getFilters(): Filter[] {
    return Array.from(this.filters.values());
  }
}
