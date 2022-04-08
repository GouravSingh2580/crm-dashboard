import {
  transformTextForKey,
  capitalizeFirstLetter,
  formatSsn,
  formatNumberWithDashes,
} from '../text-transformer';

describe('TextTransformer test', () => {
  it('capitalizeFirstLetter test', () => {
    expect(capitalizeFirstLetter('this is a short sentence')).toBe(
      'This is a short sentence',
    );
    expect(capitalizeFirstLetter('ALL WORD IS CAPITALIZED')).toBe(
      'All word is capitalized',
    );
  });

  it('formatSsn', () => {
    expect(formatSsn('123456789')).toBe('123-45-6789');
  });

  it('formatNumberWithDashes', () => {
    expect(formatNumberWithDashes('1234567')).toBe('1234567');
    expect(formatNumberWithDashes('1-2-3-4-5-6-7')).toBe('1234567');
  });

  it('test transformTextForKey', () => {
    expect(transformTextForKey('Test Label')).toBe('test-label');
    expect(transformTextForKey('Test  Middle     Label')).toBe(
      'test-middle-label',
    );
  });
});
