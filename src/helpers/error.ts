import { get, isString } from 'lodash';
import { AxiosError } from 'axios';

const DEFAULT_MSG = 'There is an error has been occurred, please try again';
export const getErrorMessage = (error: unknown, defaultMsg: string = DEFAULT_MSG): string => {
  if ((error as AxiosError)?.isAxiosError === true) {
    return get(error, 'response.data', defaultMsg);
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return defaultMsg;
};
