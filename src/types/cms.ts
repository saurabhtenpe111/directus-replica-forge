
export interface Collection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  fields: Field[];
  schema?: CollectionSchema;
  lastModified: Date;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  default?: any;
  options?: Record<string, any>;
}

export type FieldType = 
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'json'
  | 'uuid'
  | 'image'
  | 'file'
  | 'relation';

export interface CollectionSchema {
  table: string;
  columns: Record<string, SchemaColumn>;
}

export interface SchemaColumn {
  type: string;
  nullable: boolean;
  default?: any;
}

export interface Item {
  id: string;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
}

export type Role = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'invited' | 'blocked';

export interface Activity {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  userId: string;
  collectionName?: string;
  itemId?: string;
  timestamp: Date;
}

export interface Dashboard {
  totalCollections: number;
  totalUsers: number;
  totalItems: number;
  recentActivity: Activity[];
}
