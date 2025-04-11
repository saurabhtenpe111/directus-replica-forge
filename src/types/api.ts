
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

export interface ApiPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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
}
