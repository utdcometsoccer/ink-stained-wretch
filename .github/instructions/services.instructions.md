# API Services Development Instructions

## Overview
API service files in `src/services/` provide typed interfaces to backend APIs and external services.

## Service File Structure

### Standard Service Pattern
```typescript
import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface ServiceResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ServiceError {
  message: string;
  status?: number;
  details?: any;
}

// Type-safe API function
export const fetchResource = async (
  token: string,
  id: string
): Promise<ResourceType> => {
  try {
    const response = await axios.get<ServiceResponse<ResourceType>>(
      `${API_BASE_URL}/api/resource/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ServiceError>;
      throw new Error(
        axiosError.response?.data?.message || 
        'Failed to fetch resource'
      );
    }
    throw error;
  }
};
```

## Key Services in the Project

### Author Service
- Manages author profile CRUD operations
- Handles authentication token requirements
- Returns typed Author objects

### Subscription Service
- Fetches subscription plans
- Supports pagination
- Returns SubscriptionPlan arrays

### Image Service
- Handles image uploads to Azure Blob Storage
- Validates file types and sizes
- Returns image URLs

### Stripe Service
- Creates checkout sessions
- Manages subscription lifecycle
- Handles payment webhooks (backend)

## Authentication Patterns

### Bearer Token Authentication
```typescript
const token = await acquireToken();
const response = await axios.get(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Token Refresh on Expiration
```typescript
try {
  return await makeRequest(token);
} catch (error) {
  if (isUnauthorized(error)) {
    const newToken = await refreshToken();
    return await makeRequest(newToken);
  }
  throw error;
}
```

## Error Handling

### Typed Error Responses
```typescript
interface ApiError {
  message: string;
  code?: string;
  status: number;
}

const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code,
      status: error.response?.status || 500,
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};
```

### Retry Logic
```typescript
const retryRequest = async <T>(
  request: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await request();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};
```

## Request/Response Patterns

### GET Requests
```typescript
export const getResource = async (id: string): Promise<Resource> => {
  const response = await axios.get<Resource>(`/api/resource/${id}`);
  return response.data;
};
```

### POST Requests
```typescript
export const createResource = async (
  data: CreateResourceDto
): Promise<Resource> => {
  const response = await axios.post<Resource>('/api/resource', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};
```

### PUT/PATCH Requests
```typescript
export const updateResource = async (
  id: string,
  updates: Partial<Resource>
): Promise<Resource> => {
  const response = await axios.patch<Resource>(
    `/api/resource/${id}`,
    updates
  );
  return response.data;
};
```

### DELETE Requests
```typescript
export const deleteResource = async (id: string): Promise<void> => {
  await axios.delete(`/api/resource/${id}`);
};
```

### File Upload
```typescript
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<{ url: string }>(
    '/api/upload',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    }
  );

  return response.data;
};
```

## Pagination

### Pagination Pattern
```typescript
interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const fetchPaginatedData = async <T>(
  endpoint: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<T>> => {
  const response = await axios.get<PaginatedResponse<T>>(endpoint, {
    params: { page, pageSize },
  });
  return response.data;
};
```

## Environment Configuration

### Using Environment Variables
```typescript
// Always use VITE_ prefix for frontend environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Validate required environment variables
if (!API_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}
```

## Testing Services

### Mocking Axios
```typescript
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchResource', () => {
  it('should fetch resource successfully', async () => {
    const mockData = { id: '1', name: 'Test' };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchResource('token', '1');

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/resource/1'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      })
    );
  });

  it('should handle errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(fetchResource('token', '1')).rejects.toThrow();
  });
});
```

## Best Practices

### Type Safety
- Always type request and response objects
- Use interfaces for DTOs (Data Transfer Objects)
- Validate response data structure
- Handle null/undefined cases

### Security
- Never log or expose sensitive data (tokens, passwords)
- Validate input before sending to API
- Use HTTPS in production
- Handle CORS appropriately

### Performance
- Implement request caching when appropriate
- Use abort controllers for cancellable requests
- Batch related requests when possible
- Consider pagination for large datasets

### Error Logging
```typescript
import { appInsights } from '../telemetry';

try {
  return await apiCall();
} catch (error) {
  appInsights.trackException({ exception: error as Error });
  throw error;
}
```

## Anti-Patterns to Avoid
- ❌ Hardcoding API URLs
- ❌ Not handling errors
- ❌ Exposing sensitive data in requests/logs
- ❌ Not validating response data
- ❌ Not using TypeScript types
- ❌ Ignoring HTTP status codes
- ❌ Not implementing retry logic for transient failures
