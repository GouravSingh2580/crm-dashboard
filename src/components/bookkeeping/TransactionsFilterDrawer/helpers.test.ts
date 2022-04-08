import moment from 'moment';
import {
  convertFromLocalFilter,
  convertToLocalFilter,
  forcingMaxLength,
  isNumberString,
} from './helpers';

describe('convertToLocalFilter', () => {
  it('amount test', () => {
    const localFilter = convertToLocalFilter({
      amountGreaterThan: '1000',
      amountLessThan: '90000',
    });
    const localFilter2 = convertToLocalFilter({
      amountGreaterThan: undefined,
      amountLessThan: undefined,
    });
    expect(localFilter).toHaveProperty('amountGreaterThan', 10);
    expect(localFilter).toHaveProperty('amountLessThan', 900);
    expect(localFilter2).toHaveProperty('amountGreaterThan', undefined);
    expect(localFilter2).toHaveProperty('amountLessThan', undefined);
  });
  it('category test', () => {
    const localFilter = convertToLocalFilter({ categoryId: '1234' });
    const localFilter2 = convertToLocalFilter({ categoryId: undefined });
    expect(localFilter).toHaveProperty('categoryId', '1234');
    expect(localFilter2).toHaveProperty('categoryId', undefined);
  });
  it('from date test', () => {
    const sampleDate = moment();
    const localFilter = convertToLocalFilter({
      from: sampleDate.format('Y-MM-DD'),
    });
    const expected = sampleDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const localFilter2 = convertToLocalFilter({ from: undefined });
    const localFilter3 = convertToLocalFilter({});
    const localFilter4 = convertToLocalFilter({ from: 'asdasd' });
    const localFilter5 = convertToLocalFilter({ from: '123123' });
    expect(localFilter.from?.toISOString()).toBe(expected.toISOString());
    expect(localFilter2.from).toBe(undefined);
    expect(localFilter3.from).toBe(undefined);
    expect(localFilter4.from).toBe(undefined);
    expect(localFilter5.from).toBe(undefined);
  });
  it('to date test', () => {
    const sampleDate = moment();
    const localFilter = convertToLocalFilter({
      to: sampleDate.format('Y-MM-DD'),
    });
    const expected = sampleDate.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const localFilter2 = convertToLocalFilter({ to: undefined });
    const localFilter3 = convertToLocalFilter({});
    const localFilter4 = convertToLocalFilter({ to: 'asdasd' });
    expect(localFilter.to?.toISOString()).toBe(expected.toISOString());
    expect(localFilter2.to).toBe(undefined);
    expect(localFilter3.to).toBe(undefined);
    expect(localFilter4.to).toBe(undefined);
  });
});

describe('convertFromLocalFilter', () => {
  it('amount test', () => {
    const localFilter = convertFromLocalFilter({
      amountGreaterThan: 100,
      amountLessThan: 900,
    });
    const localFilter2 = convertFromLocalFilter({
      categoryId: undefined,
      from: undefined,
      amountGreaterThan: undefined,
      amountLessThan: undefined,
    });
    expect(localFilter).toHaveProperty('amountGreaterThan', '10000');
    expect(localFilter).toHaveProperty('amountLessThan', '90000');
    expect(localFilter2).toHaveProperty('amountGreaterThan', undefined);
    expect(localFilter2).toHaveProperty('amountLessThan', undefined);
  });
  it('category test', () => {
    const localFilter = convertFromLocalFilter({ categoryId: '1234' });
    const localFilter2 = convertFromLocalFilter({ categoryId: undefined });
    expect(localFilter).toHaveProperty('categoryId', '1234');
    expect(localFilter2).toHaveProperty('categoryId', undefined);
  });
  it('from date test', () => {
    const sampleDate = moment('2022-02-02T01:01:01.000Z');
    const expected = sampleDate.set({
      hour: 0,
      minute: 0,
      millisecond: 0,
      second: 0,
    });
    const localFilter = convertFromLocalFilter({ from: sampleDate });
    const localFilter2 = convertFromLocalFilter({ from: undefined });
    const localFilter3 = convertFromLocalFilter({ from: moment('asdasd') });
    const localFilter4 = convertFromLocalFilter({});
    expect(localFilter.from).toBe(expected.toISOString());
    expect(localFilter2.from).toBe(undefined);
    expect(localFilter3.from).toBe(undefined);
    expect(localFilter4.from).toBe(undefined);
  });
  it('to date test', () => {
    const sampleDate = moment('2022-02-02T01:01:01.000Z');
    const expected = sampleDate.set({
      hour: 0,
      minute: 0,
      millisecond: 0,
      second: 0,
    });
    const localFilter = convertFromLocalFilter({ to: sampleDate });
    const localFilter2 = convertFromLocalFilter({ to: undefined });
    const localFilter3 = convertFromLocalFilter({ to: moment('asdasd') });
    const localFilter4 = convertFromLocalFilter({});
    expect(localFilter.to).toBe(expected.toISOString());
    expect(localFilter2.to).toBe(undefined);
    expect(localFilter3.to).toBe(undefined);
    expect(localFilter4.to).toBe(undefined);
  });
});

describe('forcingMaxLength', () => {
  it('default', () => {
    expect(forcingMaxLength(123)).toBe(123);
    expect(forcingMaxLength(12345678901234567)).toBe(123456789012);
    expect(forcingMaxLength(123456789012)).toBe(123456789012);
    expect(forcingMaxLength(undefined)).toBe(undefined);
  });
  it('with max param', () => {
    expect(forcingMaxLength(123, 3)).toBe(123);
    expect(forcingMaxLength(123456, 3)).toBe(123);
    expect(forcingMaxLength(12, 3)).toBe(12);
    expect(forcingMaxLength(undefined, 3)).toBe(undefined);
  });
});

describe('isNumberString', () => {
  it('true cases', () => {
    expect(isNumberString('123')).toBeTruthy();
    expect(isNumberString('1238632423')).toBeTruthy();
    expect(isNumberString('123.123')).toBeTruthy();
    expect(isNumberString('-123')).toBeTruthy();
  });
  it('false cases', () => {
    expect(isNumberString('123a')).toBeFalsy();
    expect(isNumberString('')).toBeFalsy();
    expect(isNumberString(undefined)).toBeFalsy();
    expect(isNumberString('abc')).toBeFalsy();
    expect(isNumberString('-abc')).toBeFalsy();
  });
});
