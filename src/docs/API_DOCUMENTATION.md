
# Spring Boot API Documentation

This documentation outlines the API endpoints and integration details for the CMS frontend application with a Spring Boot backend.

## Base URL Configuration

The API base URL is configured in `src/config/api.config.ts`. It uses the environment variable `VITE_API_BASE_URL` or defaults to `http://localhost:8080/api` if not set.

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  CONTENT_TYPE: 'application/json',
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};
```

## Authentication

### Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticates user and returns authentication token
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "string",
    "tokenType": "string",
    "expiresIn": "number",
    "refreshToken": "string",
    "userId": "string",
    "roles": ["string"]
  }
  ```

### Logout
- **Endpoint**: `POST /auth/logout`
- **Description**: Logs out the current user
- **Request**: No body required, but Authorization header must contain valid token
- **Response**: 200 OK status code on success

### Register
- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string"
  }
  ```
- **Response**: Returns the created user object

### Current User
- **Endpoint**: `GET /auth/me`
- **Description**: Returns the current authenticated user's information
- **Request**: Requires Authorization header with valid token
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "roles": ["string"],
    "enabled": "boolean",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

## Collections

### Fetch All Collections
- **Endpoint**: `GET /collections`
- **Description**: Returns all collections
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "apiId": "string",
      "description": "string",
      "status": "string",
      "icon": "string",
      "iconColor": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "itemCount": "number",
      "fieldCount": "number"
    }
  ]
  ```

### Create Collection
- **Endpoint**: `POST /collections`
- **Description**: Creates a new collection
- **Request Body**:
  ```json
  {
    "title": "string",
    "apiId": "string",
    "description": "string",
    "status": "string",
    "icon": "string",
    "iconColor": "string"
  }
  ```
- **Response**: Returns the created collection object

### Get Collection by ID
- **Endpoint**: `GET /collections/{id}`
- **Description**: Returns a single collection by ID
- **Parameters**: `id` - Collection ID (path parameter)
- **Response**: Collection object as shown above

### Update Collection
- **Endpoint**: `PUT /collections/{id}`
- **Description**: Updates an existing collection
- **Parameters**: `id` - Collection ID (path parameter)
- **Request Body**: Same as create collection
- **Response**: Updated collection object

### Delete Collection
- **Endpoint**: `DELETE /collections/{id}`
- **Description**: Deletes a collection
- **Parameters**: `id` - Collection ID (path parameter)
- **Response**: 200 OK status code on success

## Fields

### Fetch Fields for Collection
- **Endpoint**: `GET /collections/{collectionId}/fields`
- **Description**: Returns all fields for a collection
- **Parameters**: `collectionId` - Collection ID (path parameter)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "apiId": "string",
      "type": "string",
      "description": "string",
      "required": "boolean",
      "collectionId": "string",
      "sortOrder": "number",
      "generalSettings": {},
      "validationSettings": {},
      "appearanceSettings": {},
      "advancedSettings": {},
      "uiOptionsSettings": {},
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```

### Create Field
- **Endpoint**: `POST /collections/{collectionId}/fields`
- **Description**: Creates a new field in a collection
- **Parameters**: `collectionId` - Collection ID (path parameter)
- **Request Body**:
  ```json
  {
    "name": "string",
    "apiId": "string",
    "type": "string",
    "description": "string",
    "required": "boolean",
    "generalSettings": {},
    "validationSettings": {},
    "appearanceSettings": {},
    "advancedSettings": {},
    "uiOptionsSettings": {}
  }
  ```
- **Response**: Returns the created field object

### Get Field by ID
- **Endpoint**: `GET /collections/{collectionId}/fields/{fieldId}`
- **Description**: Returns a single field
- **Parameters**: 
  - `collectionId` - Collection ID (path parameter)
  - `fieldId` - Field ID (path parameter)
- **Response**: Field object as shown above

### Update Field
- **Endpoint**: `PUT /collections/{collectionId}/fields/{fieldId}`
- **Description**: Updates an existing field
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `fieldId` - Field ID (path parameter)
- **Request Body**: You can update just the specific settings section you want to modify
  ```json
  {
    "name": "string", // optional
    "apiId": "string", // optional
    "description": "string", // optional
    "required": "boolean", // optional
    "generalSettings": {}, // optional
    "validationSettings": {}, // optional
    "appearanceSettings": {}, // optional
    "advancedSettings": {}, // optional
    "uiOptionsSettings": {} // optional
  }
  ```
- **Response**: Updated field object

### Update Specific Field Settings
- **Endpoint**: `PATCH /collections/{collectionId}/fields/{fieldId}`
- **Description**: Updates specific field settings sections
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `fieldId` - Field ID (path parameter)
- **Request Body**: Include only the specific settings sections you want to update
  ```json
  {
    "generalSettings": {}, // update only general settings
    // OR
    "validationSettings": {}, // update only validation settings
    // OR 
    "appearanceSettings": {}, // update only appearance settings
    // etc.
  }
  ```
- **Response**: Updated field object

### Delete Field
- **Endpoint**: `DELETE /collections/{collectionId}/fields/{fieldId}`
- **Description**: Deletes a field
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `fieldId` - Field ID (path parameter)
- **Response**: 200 OK status code on success

### Update Field Order
- **Endpoint**: `PUT /collections/{collectionId}/fields/order`
- **Description**: Updates the order of fields in a collection
- **Parameters**: `collectionId` - Collection ID (path parameter)
- **Request Body**:
  ```json
  [
    {
      "id": "string",
      "sortOrder": "number"
    }
  ]
  ```
- **Response**: 200 OK status code on success

## Content

### Fetch Content for Collection
- **Endpoint**: `GET /collections/{collectionId}/content`
- **Description**: Returns all content items for a collection
- **Parameters**: `collectionId` - Collection ID (path parameter)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "collectionId": "string",
      "data": {},
      "status": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "createdBy": "string",
      "updatedBy": "string",
      "version": "number"
    }
  ]
  ```

### Create Content Item
- **Endpoint**: `POST /collections/{collectionId}/content`
- **Description**: Creates a new content item in a collection
- **Parameters**: `collectionId` - Collection ID (path parameter)
- **Request Body**:
  ```json
  {
    "data": {},
    "status": "string"
  }
  ```
- **Response**: Returns the created content item

### Get Content Item by ID
- **Endpoint**: `GET /collections/{collectionId}/content/{itemId}`
- **Description**: Returns a single content item
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `itemId` - Content Item ID (path parameter)
- **Response**: Content item object as shown above

### Update Content Item
- **Endpoint**: `PUT /collections/{collectionId}/content/{itemId}`
- **Description**: Updates an existing content item
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `itemId` - Content Item ID (path parameter)
- **Request Body**: Same as create content item
- **Response**: Updated content item object

### Delete Content Item
- **Endpoint**: `DELETE /collections/{collectionId}/content/{itemId}`
- **Description**: Deletes a content item
- **Parameters**:
  - `collectionId` - Collection ID (path parameter)
  - `itemId` - Content Item ID (path parameter)
- **Response**: 200 OK status code on success

## Components

### Fetch All Components
- **Endpoint**: `GET /components`
- **Description**: Returns all components
- **Response**: Array of component objects

### Create Component
- **Endpoint**: `POST /components`
- **Description**: Creates a new component
- **Request Body**: Component object
- **Response**: Returns the created component

### Get Component by ID
- **Endpoint**: `GET /components/{id}`
- **Description**: Returns a single component by ID
- **Parameters**: `id` - Component ID (path parameter)
- **Response**: Component object

### Update Component
- **Endpoint**: `PUT /components/{id}`
- **Description**: Updates an existing component
- **Parameters**: `id` - Component ID (path parameter)
- **Request Body**: Component object
- **Response**: Updated component object

### Delete Component
- **Endpoint**: `DELETE /components/{id}`
- **Description**: Deletes a component
- **Parameters**: `id` - Component ID (path parameter)
- **Response**: 200 OK status code on success

## Field Settings Database Structure

The Spring Boot backend stores field settings in dedicated columns for each settings type. This allows for more efficient querying and updating of specific settings without modifying the entire field object.

### Field Settings Columns

Each field in the database has the following settings columns:

1. **generalSettings**: Stores general field configuration
   - Description
   - Help text
   - Placeholder
   - Default values
   - Field-specific properties (keyFilter, min/max values, etc.)
   - Hidden in forms flag

2. **validationSettings**: Stores validation rules
   - Required flag
   - Min/max length
   - Pattern validation
   - Custom validation rules

3. **appearanceSettings**: Stores visual appearance configuration
   - UI variant (standard, material, pill, etc.)
   - Color schemes
   - Theme configuration
   - Custom CSS
   - Text alignment and positioning

4. **advancedSettings**: Stores advanced configuration
   - Conditional display rules
   - Data binding
   - Masks and formatting
   - Custom data attributes
   - Accessibility options

5. **uiOptionsSettings**: Stores UI-specific options
   - Width configuration
   - Display modes
   - Character counting
   - Special UI behaviors

### API Adapter Functions

The frontend uses adapter functions to correctly map settings to their respective columns:

```typescript
// Frontend to Backend adapters
adaptFieldToApi(field) {
  return {
    id: field.id,
    name: field.name,
    apiId: field.apiId,
    type: field.type,
    description: field.description,
    required: field.required || false,
    collectionId: field.collection_id,
    sortOrder: field.sort_order || 0,
    
    // Convert the settings objects to match Spring Boot's expected format
    generalSettings: convertToSpringFormat(field.general_settings || {}),
    validationSettings: convertToSpringFormat(field.validation_settings || {}),
    appearanceSettings: convertToSpringFormat(field.appearance_settings || {}),
    advancedSettings: convertToSpringFormat(field.advanced_settings || {}),
    uiOptionsSettings: convertToSpringFormat(field.ui_options_settings || {})
  };
}

// Backend to Frontend adapters
adaptApiToField(apiField) {
  return {
    id: apiField.id,
    name: apiField.name,
    apiId: apiField.apiId,
    type: apiField.type,
    description: apiField.description,
    required: apiField.required || false,
    collection_id: apiField.collectionId,
    sort_order: apiField.sortOrder || 0,
    
    // Settings from dedicated columns - store in both formats for compatibility
    validation_settings: apiField.validationSettings || {},
    appearance_settings: apiField.appearanceSettings || {},
    advanced_settings: apiField.advancedSettings || {},
    ui_options_settings: apiField.uiOptionsSettings || {},
    general_settings: apiField.generalSettings || {}
  };
}
```

### Example Request to Update Field Settings

When updating individual settings sections, you should only include the section you're modifying:

```javascript
// Update only validation settings
await updateField(collectionId, fieldId, { 
  validationSettings: {
    required: true,
    minLength: 5,
    maxLength: 100
  }
});

// Update only appearance settings
await updateField(collectionId, fieldId, {
  appearanceSettings: {
    uiVariant: "standard",
    colors: {
      border: "#e2e8f0",
      text: "#333333"
    }
  }
});
```

## Error Handling

The API follows standard HTTP status codes for error responses:

- **200 OK**: The request has succeeded
- **201 Created**: A new resource has been created
- **400 Bad Request**: The request could not be understood or was missing required parameters
- **401 Unauthorized**: Authentication failed or user does not have permissions for requested operation
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Error responses have the following format:
```json
{
  "status": "number",
  "message": "string",
  "error": "string",
  "errors": {
    "field_name": ["error message"]
  },
  "timestamp": "string",
  "path": "string",
  "trace": "string"
}
```

## Spring Boot Setup Requirements

1. The Spring Boot backend should implement all the endpoints described above
2. JWT authentication should be configured
3. CORS should be enabled for the frontend origin
4. Response formats should match the expected structures
5. Field settings should use camelCase property names in dedicated columns
6. Validation errors should follow the standard Spring Boot format
