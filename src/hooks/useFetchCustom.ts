// types/api.types.ts
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: number;
  message: string;
}

// utils/api.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

const handleError = (error: AxiosError): ApiError => {
  const statusCode = error.response?.status;
  let message = 'An unexpected error occurred';

  switch (statusCode) {
    case 400:
      message = 'Bad Request - Please check your input';
      break;
    case 401:
      message = 'Unauthorized - Please login again';
      // Có thể thêm logic để redirect tới trang login
      break;
    case 403:
      message = 'Forbidden - You do not have permission';
      break;
    case 500:
      message = 'Internal Server Error - Please try again later';
      break;
    default:
      message = error.message;
  }

  return {
    code: statusCode || 500,
    message,
  };
};

export const fetchApi = async <T>(
  url: string,
  actionCode?: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const headers = {
      ...(actionCode && { 'Action-Code': actionCode }),
      ...config?.headers,
    };

    const response = await axiosInstance({
      ...config,
      url,
      headers,
    });

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    const apiError = handleError(error as AxiosError);
    throw apiError;
  }
};

// Custom hooks for GET requests
export const useApiGet = <T>(
  url: string,
  actionCode?: string,
  config?: AxiosRequestConfig
) => {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: [url, actionCode],
    queryFn: () => fetchApi<T>(url, actionCode, { ...config, method: 'GET' }),
  });
};

// Custom hooks for POST requests
export const useApiPost = <T, TData = any>() => {
  return useMutation<ApiResponse<T>, ApiError, { url: string; data: TData; actionCode?: string; config?: AxiosRequestConfig }>({
    mutationFn: ({ url, data, actionCode, config }) =>
      fetchApi<T>(url, actionCode, {
        ...config,
        method: 'POST',
        data,
      }),
  });
};