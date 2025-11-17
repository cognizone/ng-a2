import { DateRangeFilter } from './date-range-filter';

describe('DateRangeFilter', () => {
  const testDate = new Date('2023-01-15T10:30:00Z');

  it('should create DateRangeFilter', () => {
    const filter = new DateRangeFilter('dateField', 'dateFilter', 'gte', undefined, testDate.getTime());
    expect(filter.getValue()).toBe(testDate.getTime());
  });

  it('getValuePretty should return ISO string by default', () => {
    const filter = new DateRangeFilter('dateField', 'dateFilter', 'gte', undefined, testDate.getTime());
    expect(filter.getValuePretty()).toBe(testDate.toISOString());
  });

  it('getValuePretty should use custom dateToString function', () => {
    const customFormatter = (date: Date) => date.toLocaleDateString('en-US');
    const filter = new DateRangeFilter('dateField', 'dateFilter', 'gte', customFormatter, testDate.getTime());
    expect(filter.getValuePretty()).toBe(testDate.toLocaleDateString('en-US'));
  });
});
