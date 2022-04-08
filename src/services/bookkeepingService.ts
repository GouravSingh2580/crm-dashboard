import axios, { AxiosError } from 'axios';
import { CONFIG } from 'config';
import { AuthService } from 'services';

export const bookkeepingService = axios.create({
  baseURL: CONFIG.apiBookkeepingUrl,
  timeout: 5000,
});

bookkeepingService.interceptors.request.use((req) => {
  const accessToken = AuthService.userToken();

  // @ts-ignore
  req.headers.Authorization = `Bearer ${accessToken}`;
  return req;
});

/**
 * For 401 - Redirect to login page.
 */
bookkeepingService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = `${window.location.origin}/login`;
    }

    return Promise.reject(error);
  },
);
