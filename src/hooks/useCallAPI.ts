import axios from 'axios';
import useSWR from 'swr';

// Định nghĩa kiểu cho options của API request
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7241/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetcher function sử dụng axios
const fetcher = async (url: string, options: ApiRequestOptions = {}) => {
  const { method, data } = options;
  
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
    });
    
    return response.data;
  } catch (error) {
    // Xử lý lỗi một cách chi tiết
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Xử lý token hết hạn, có thể thêm logic refresh token ở đây
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }

      // Lỗi server
      if(error.response?.status === 500){

      }

      // Lỗi input đầu vào
      if(error.response?.status === 400){

      }
      throw error.response?.data || error.message;
    }
    throw error;
  }
};

// Custom hook để sử dụng SWR
export function useApi<T = any>(
  url: string, 
  options: ApiRequestOptions = {}
) {
  const { data, error, mutate } = useSWR<T>(
    url, 
    fetcher
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
}

// Custom hook để thực hiện mutation (POST, PUT, DELETE)
export function useApiMutation<T = any>() {
  const callAPI = async (
    url: string, 
    options: any
  ): Promise<T> => {
    return fetcher(url, options);
  };

  return callAPI;
}