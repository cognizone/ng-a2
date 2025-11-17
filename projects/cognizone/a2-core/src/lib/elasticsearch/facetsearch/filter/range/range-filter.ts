import { AbstractFilter } from '../abstract-filter';
import { ElasticQueryJson } from '../../elastic-query-json';

export class RangeFilter extends AbstractFilter {
  rangeType: string;

  constructor(queryKey: string, filterKey: string, rangeType: string, value?: any) {
    super(queryKey, value, filterKey);
    this.rangeType = rangeType;
  }

  public addFilterToQuery(query: ElasticQueryJson): void {
    if (this.isActive()) query.query.bool.filter.push(this.toElasticFilter());
  }

  private toElasticFilter() {
    const inner = {};
    inner[this.rangeType] = this.getValue();
    const outer = {};
    outer[this.getQueryKey()] = inner;
    return { range: outer };
  }

  public getValuePretty(): any {
    return String(this.getValue());
  }

  public valueIsArray() {
    return false;
  }

  clearValue() {
    this.value = null;
  }

  setValue(value: any) {
    this.value = value;
  }
}
