import { AxiosError } from './axios';

export type APIErrorProperty = {
  field: string;
  message: string;
  value: any;
};

export type APIErrorPropertiesMap = Record<string, APIErrorProperty>;

export type APIErrorType =
  | 'BadRequestError'
  | 'MalformedInputError'
  | 'UnauthorizedError'
  | 'ForbiddenError';

export type APIErrorResponse = {
  message: string;
  type: APIErrorType;
  properties?: APIErrorPropertiesMap;
};

export enum StatusCode {
  NotFound = 404,
  InternalError = 500,
}

export function hasStatusCode(err: AxiosError, statusCode: StatusCode): boolean {
  if (err.response) {
    return err.response.status === statusCode;
  }
  return false;
}
