import { numberFormat, roundOffToNearest100 } from '../currencyFormat';

describe('currency format test', () => {
  it('should return number format', () => {
    expect(numberFormat(1000000)).toBe('$1,000,000');
    expect(numberFormat(123.4567)).toBe('$123');
  });

  it('should round to 2 digits', () => {
    expect(roundOffToNearest100(1234.5678)).toBe(1200);
  });
});
