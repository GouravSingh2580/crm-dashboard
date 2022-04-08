import { getErrorMessage } from 'helpers/error';

class AxiosError extends Error {
  public isAxiosError: boolean;

  public response: Object;

  constructor(message: string, data: any) {
    super(message);
    this.isAxiosError = true;
    this.response = {
      data,
    };
  }
}

describe('error test', () => {
  it('should return default error', () => {
    const defaultMsg = 'There is an error has been occurred, please try again';
    expect(getErrorMessage(null)).toBe(defaultMsg);
    expect(getErrorMessage(undefined)).toBe(defaultMsg);
    expect(getErrorMessage({})).toBe(defaultMsg);
    expect(getErrorMessage(true)).toBe(defaultMsg);
    expect(getErrorMessage(123)).toBe(defaultMsg);
  });
  it('should return string error', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });
  it('should get from Error instance', () => {
    const error = new Error('custom error');
    expect(getErrorMessage(error)).toBe('custom error');
  });
  it('should get from AxiosError', () => {
    const error = new AxiosError('custom error', 'response error message');
    expect(getErrorMessage(error)).toBe('response error message');
  });
});
