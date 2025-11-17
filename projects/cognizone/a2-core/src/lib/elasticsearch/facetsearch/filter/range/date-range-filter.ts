import { RangeFilter } from './range-filter';

export class DateRangeFilter extends RangeFilter {
  constructor(queryKey: string, filterKey: string, rangeType: string, dateToString?: (date: Date) => string, value?: any) {
    super(queryKey, filterKey, rangeType, value);
    if (dateToString) this.dateToString = dateToString;
  }

  public getValuePretty() {
    return this.dateToString(new Date(this.getValue()));
  }

  private dateToString: Function = (date: Date): string => {
    return date.toISOString();
  };
}
