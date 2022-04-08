export const numberFormat = (value: number, defaultMaxFraction: number = 0): string => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: defaultMaxFraction,
  minimumFractionDigits: 0,
}).format(value);

export const roundOffToNearest100 = (value: number): number => {
  try {
    return Math.floor(value / 100) * 100;
  } catch (error) {
    console.log(error);
    return value;
  }
};
