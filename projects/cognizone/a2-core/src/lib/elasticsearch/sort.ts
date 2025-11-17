import { ParamMap } from '@angular/router';

export interface Sort {
  getAscending(key: string): boolean;
  setAscending(key: string, ascending: boolean): void;

  getEnabled(key: string): boolean;
  setEnabled(key: string, enabled: boolean): void;

  disable();

  toElasticQuerySort(): any;

  addToQueryParams(params: Object): void;
  setFromQueryParams(params: ParamMap): void;

  getPriorityQueue(): string[];
}
