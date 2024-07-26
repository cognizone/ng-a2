import { ElasticQueryJson } from '../elastic-query-json';

export interface Filter {
  setActive(active: boolean);
  isActive(): boolean;

  getValue(): any;
  setValue(value: any);
  clearValue();

  getFilterKey(): string;
  getQueryKey(): string;

  //shows the value the way it should be displayed on screen,
  getValuePretty(): any;
  valueIsArray();

  addFilterToQuery(query: ElasticQueryJson);
}
