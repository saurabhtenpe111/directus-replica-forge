
// Environment configuration
interface EnvConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  appName: string;
  version: string;
}

// Get environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const isDevelopment = import.meta.env.DEV || false;
const isProduction = import.meta.env.PROD || false;
const appName = import.meta.env.VITE_APP_NAME || 'CMS';
const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ENV: EnvConfig = {
  apiBaseUrl,
  isDevelopment,
  isProduction,
  appName,
  version
};

export default ENV;
