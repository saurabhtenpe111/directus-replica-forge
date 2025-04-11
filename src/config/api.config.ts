
// API configuration settings
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  CONTENT_TYPE: 'application/json',
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Spring Boot specific endpoints
export const API_ENDPOINTS = {
  // Collection endpoints
  COLLECTIONS: '/collections',
  COLLECTION_BY_ID: (id: string) => `/collections/${id}`,
  
  // Fields endpoints
  FIELDS: (collectionId: string) => `/collections/${collectionId}/fields`,
  FIELD_BY_ID: (collectionId: string, fieldId: string) => `/collections/${collectionId}/fields/${fieldId}`,
  FIELD_ORDER: (collectionId: string) => `/collections/${collectionId}/fields/order`,
  
  // Content endpoints
  CONTENT: (collectionId: string) => `/collections/${collectionId}/content`,
  CONTENT_BY_ID: (collectionId: string, itemId: string) => `/collections/${collectionId}/content/${itemId}`,
  
  // Components endpoints
  COMPONENTS: '/components',
  COMPONENT_BY_ID: (id: string) => `/components/${id}`,
  
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  CURRENT_USER: '/auth/me'
};
