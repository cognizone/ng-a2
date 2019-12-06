import {ParamMap} from '@angular/router';
import {Sort} from './sort';

abstract class AbstractSort implements Sort {

  public static builder(): SortBuilder {
    return new SortBuilder();
  }

  abstract getAscending(key: string): boolean;
  abstract setAscending(key: string, ascending: boolean): void;

  abstract getEnabled(key: string): boolean;
  abstract setEnabled(key: string, enabled: boolean): void;

  abstract toElasticQuerySort(): any;

  abstract addToQueryParams(params: Object): void;

  abstract setFromQueryParams(params: ParamMap): void;

  abstract getPriorityQueue(): string[];

  abstract disable();
}

class PriorityToMostRecentSort extends AbstractSort {

  private sortFields: Map<string, SortField> = new Map<string, SortField>();

  private _priorityQueue: string[];

  constructor(sortFields: Map<string, SortField>) {
    super();
    this.sortFields = sortFields;

    this._priorityQueue = [];
    sortFields.forEach(value => {
      if (value.enabled) {
        this._priorityQueue.push(value.key);
      }
    });
  }

  getPriorityQueue(): string[] {
    return this._priorityQueue;
  }

  addToQueryParams(params: Object) {
    params['sort'] = this._priorityQueue;
  }

  setFromQueryParams(params: ParamMap) {

    const sortParams: string[] = params.getAll('sort');
    if (sortParams.length > 0) {
      this.sortFields.forEach(field => field.enabled = false);
      this._priorityQueue = [];
    }
    sortParams.reverse();
    sortParams.forEach(key => this.setEnabled(key, true));
  }

  toElasticQuerySort(): any {
    const sort = {};

    this._priorityQueue.forEach(key => {
      const sortField = this.sortFields.get(key);
      const keyword = sortField.keyword ? '.keyword' : '';
      sort[sortField.key + keyword] = {order: sortField.ascending ? 'asc' : 'desc'};
    });
    return sort;
  }

  getAscending(key: string): boolean {
    return this.getOrCreate(key).ascending;
  }

  setAscending(key: string, ascending: boolean) {
    this.getOrCreate(key).ascending = ascending;
  }

  getEnabled(key: string): boolean {
    return this.getOrCreate(key).enabled;
  }

  setEnabled(key: string, enabled: boolean) {
    const sortField = this.getOrCreate(key);

    const alreadyEnabled = sortField.enabled;
    if (!enabled) this.removeFromQueue(key);
    else if (!alreadyEnabled) this._priorityQueue.unshift(key);

    if (enabled && alreadyEnabled) {
      this.removeFromQueue(key);
      this._priorityQueue.unshift(key);
    }

    sortField.enabled = enabled;
  }

  private createSortField(key: string): SortField {
    return {key: key, enabled: false, ascending: false, keyword: false, missingFirst: false};
  }

  private removeFromQueue(key: string): void {
    const index = this._priorityQueue.indexOf(key);
    if (index === -1) return;
    this._priorityQueue.splice(index, 1);
  }

  private getOrCreate(key: string): SortField {
    let sortField = this.sortFields.get(key);
    if (sortField == null) {
      sortField = this.createSortField(key);
      this.sortFields.set(key, sortField);
    }
    return sortField;
  }

  disable() {
    throw new Error('Method not implemented.');
  }
}

class SingleSort extends AbstractSort {

  private sortFields: Map<string, SortField> = new Map<string, SortField>();


  activeSortKey: string;
  ascending = false;

  constructor(sortFields: Map<string, SortField>) {
    super();
    this.sortFields = sortFields;

    sortFields.forEach(value => {
      if (value.enabled) {
        this.activeSortKey = value.key;
      }
    });

  }

  getAscending(key: string): boolean {
    return key === this.activeSortKey ? this.ascending : false;
  }

  setAscending(key: string, ascending: boolean): void {
    if (key === this.activeSortKey) this.ascending = ascending;
  }

  getEnabled(key: string): boolean {
    return key === this.activeSortKey;
  }

  setEnabled(key: string, enabled: boolean): void {
    this.activeSortKey = enabled ? key : null;
  }

  toElasticQuerySort(): any {

    if (!this.activeSortKey) return {};
    const sortField = this.sortFields.get(this.activeSortKey);
    if (!sortField) return {};

    const sort = {};
    const keyword = sortField.keyword ? '.keyword' : '';
    sort[this.activeSortKey + keyword] = {order: this.ascending ? 'asc' : 'desc', missing: sortField.missingFirst ? '_first' : '_last'};
    return sort;
  }

  addToQueryParams(params: Object): void {
    if (this.activeSortKey) params['sort'] = this.activeSortKey;
  }

  setFromQueryParams(params: ParamMap): void {
    if (params.get('sort')) this.activeSortKey = params.get('sort');
    if (params.get('ascending')) this.ascending = Boolean(params.get('ascending'));
  }

  getPriorityQueue(): string[] {
    return this.activeSortKey ? [this.activeSortKey] : [];
  }

  disable() {
    this.activeSortKey = null;
  }
}

interface SortField {
  key: string;
  enabled: boolean;
  ascending: boolean;
  keyword: boolean;
  missingFirst: boolean;
}

export class SortBuilder {

  private filters = new Map<string, SortField>();

  public static builder() {
    return new SortBuilder();
  }

  addSortField(key: string, keyword = false, enabled = false, ascending = false, missingFirst = false): SortBuilder {
    this.filters.set(key, {key: key, enabled: enabled, ascending: ascending, keyword: keyword, missingFirst: missingFirst});
    return this;
  }

  get(): Sort {
    return new SingleSort(this.filters);
  }
}
