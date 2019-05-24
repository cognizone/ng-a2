import {Filter} from './filter';
import {ElasticQueryJson} from '../elastic-query-json';

export abstract class AbstractFilter implements Filter {

  private active = false;
  private filterKey: string; //same key as it has in the filter map
  private queryKey: string;
  protected value: any;
  constructor (queryKey: string, value?: any, filterKey?: string) {
    this.filterKey = filterKey ? filterKey : queryKey;
    this.queryKey = queryKey;
    this.value = value;


    if (value != null && !(value instanceof Array && value.length==0)) {
      this.active = true;
    }
  }

  abstract addFilterToQuery(query: ElasticQueryJson): void;

  public setActive (active: boolean) {
    this.active = active;
  }

  public isActive (): boolean {
    return this.active;
  }

  public getValue(): any {
    return this.value;
  }

  public getValuePretty(): any {
    return this.value;
  }

  abstract setValue(value: any);
  abstract clearValue();

  public abstract valueIsArray();

  public getQueryKey(): string {
    return this.queryKey;
  }

  public getFilterKey(): string {
    return this.filterKey;
  }

}
