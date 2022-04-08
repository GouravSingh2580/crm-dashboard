import { Filters } from 'hooks/api/useBankTransactions';
import moment, { Moment } from 'moment';

export interface LocalFilters {
  from?: Moment,
  to?: Moment,
  categoryId?: string,
  amountGreaterThan?: number,
  amountLessThan?: number,
  source?: string,
}

export const convertToLocalFilter = (filter: Filters): LocalFilters => {
  const from = filter.from != null ? moment(filter.from) : undefined;
  const to = filter.to != null ? moment(filter.to) : undefined;
  return {
    categoryId: filter.categoryId || undefined,
    from: from && from.isValid() ? from : undefined,
    to: to && to.isValid() ? to : undefined,
    source: filter.source,
    amountGreaterThan: Number.isNaN(Number(filter.amountGreaterThan))
      ? undefined
      : Number(filter.amountGreaterThan) / 100,
    amountLessThan: Number.isNaN(Number(filter.amountLessThan))
      ? undefined
      : Number(filter.amountLessThan) / 100,
  };
};

export const convertFromLocalFilter = (filter: LocalFilters): Filters => {
  const from = filter.from && filter.from.isValid()
    ? moment(filter.from).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()
    : undefined;
  const to = filter.to && filter.to.isValid()
    ? moment(filter.to).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toISOString()
    : undefined;

  return {
    categoryId: filter.categoryId || undefined,
    source: filter.source || undefined,
    from,
    to,
    amountGreaterThan: filter.amountGreaterThan != null
      ? String(filter.amountGreaterThan * 100)
      : undefined,
    amountLessThan: filter.amountLessThan != null
      ? String(filter.amountLessThan * 100)
      : undefined,
  };
};

export const forcingMaxLength = (val: number | undefined, max = 12):number | undefined => {
  if (val == null) return val;
  const newVal = String(val).substr(0, max);
  return Number(newVal);
};

export const isNumberString = (val: string | undefined): boolean => {
  if (val == null || val === '') return false;
  return !Number.isNaN(Number(val));
};

export const formatAmount = (amount: number) => `$${(Math.abs(amount) / 100).toFixed(2)}`;
