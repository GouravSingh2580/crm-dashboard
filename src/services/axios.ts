import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CONFIG } from 'config';
import { AuthService } from 'services';
import { Category, logError } from 'helpers/sentry';

const generateServiceInstance = (options: AxiosRequestConfig) => {
  const instance = axios.create(options);

  instance.interceptors.request.use((req) => {
    const accessToken = AuthService.userToken();

    req.headers!.Authorization = `Bearer ${accessToken}`;
    return req;
  });

  /**
   * For 401 - Redirect to login page.
   */
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;

      // log error
      logError({
        category: Category.Service,
        message: error.response?.data || error.message,
        data: error.response,
      });

      if (status === 401) {
        window.location.href = `${window.location.origin}/login`;
      }

      return Promise.reject(error);
    },
  );
  return instance;
}

const apiClient = generateServiceInstance({
  baseURL: CONFIG.apiUrl,
  timeout: 10000,
})

export const payrollService = generateServiceInstance({
  baseURL: `${CONFIG.apiPayrollUrl}/v1/`,
  timeout: 5000,
})

/**
 * @deprecated use import { api } from 'axios'
 */
export default apiClient;

export const api = apiClient;
export { axios };
export type { AxiosError, AxiosResponse };
