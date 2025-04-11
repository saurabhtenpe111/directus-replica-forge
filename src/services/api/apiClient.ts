
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from '@/hooks/use-toast';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request interceptor - could be used to add authentication tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get JWT token from local storage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Spring Boot usually returns data directly or wrapped in a 'data' property
    // This helps standardize the response format
    return response.data?.data ? response.data : response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with an error status
      const status = error.response.status;
      let message = '';
      
      // Spring Boot error responses typically have this structure
      if (error.response.data) {
        const data = error.response.data as any;
        message = data.message || data.error || 'An error occurred';
      } else {
        message = 'Unknown error occurred';
      }

      // Handle specific status codes
      if (status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } else if (status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You don\'t have permission to perform this action.',
          variant: 'destructive',
        });
      } else if (status === 400) {
        toast({
          title: 'Validation Error',
          description: message,
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
