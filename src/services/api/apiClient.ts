
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - could be used to add authentication tokens
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You can add auth token here when authentication is implemented
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with an error status
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'An error occurred';

      // Handle specific status codes
      if (status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        // Here you could redirect to login page or clear tokens
        // e.g. window.location.href = '/login';
      } else if (status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You don\'t have permission to perform this action.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: `Error (${status})`,
          description: message,
          variant: 'destructive',
        });
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your connection.',
        variant: 'destructive',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      toast({
        title: 'Request Error',
        description: error.message || 'An error occurred while making the request.',
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
