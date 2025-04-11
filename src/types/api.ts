
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
  trace?: string;
}

export interface ApiPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty?: boolean;
  numberOfElements?: number;
}

export interface ApiCollectionResponse {
  id: string;
  title: string;
  apiId: string;
  description?: string;
  status: string;
  icon?: string;
  iconColor?: string;
  createdAt: string;
  updatedAt: string;
  itemCount?: number;
  fieldCount?: number;
}

export interface ApiFieldResponse {
  id: string;
  name: string;
  apiId: string;
  type: string;
  description?: string;
  required: boolean;
  collectionId: string;
  sortOrder: number;
  settings?: any;
  validationSettings?: Record<string, any>;
  appearanceSettings?: Record<string, any>;
  advancedSettings?: Record<string, any>;
  uiOptionsSettings?: Record<string, any>;
  generalSettings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiContentItemResponse {
  id: string;
  collectionId: string;
  data: Record<string, any>;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

// Authentication related interfaces
export interface ApiLoginRequest {
  username: string;
  password: string;
}

export interface ApiLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  userId: string;
  roles: string[];
}

export interface ApiUserResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
