# Hooks Development Instructions

## Overview
Custom hooks in `src/hooks/` encapsulate reusable stateful logic and side effects.

## Hook Naming and Structure

### Standard Hook Pattern
```typescript
import { useState, useEffect } from 'react';

interface UseFeatureOptions {
  initialValue?: string;
  onSuccess?: (data: Data) => void;
}

interface UseFeatureReturn {
  data: Data | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFeature = (
  options: UseFeatureOptions = {}
): UseFeatureReturn => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Async logic here
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Add dependencies as needed

  return { data, loading, error, refetch: fetchData };
};
```

## Key Hooks in the Project

### useAppLogic
- Main application state management
- Handles navigation and routing logic
- Manages global UI state

### useImageManager
- Image upload and management
- Handles file validation and size limits
- Interacts with Azure Blob Storage API

### useLocale
- Provides i18n translation functions
- Manages locale switching
- Returns `t` function for translations

## Best Practices for Hooks

### Return Values
- Return objects with named properties (not arrays)
- Include loading and error states
- Provide refetch/retry functions when appropriate
- Use consistent naming across hooks

### Dependencies
```typescript
// Always include all dependencies in useEffect
useEffect(() => {
  if (userId) {
    fetchUserData(userId);
  }
}, [userId]); // Include all external values used

// For functions, use useCallback
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Error Handling
```typescript
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  // Type-safe error handling
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || 'Request failed');
  } else if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

### Cleanup
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetchData(controller.signal);
  
  return () => {
    controller.abort(); // Cleanup on unmount
  };
}, []);
```

## Common Patterns

### Data Fetching Hook
```typescript
export const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### Form State Hook
```typescript
export const useFormState = <T extends Record<string, any>>(
  initialState: T
) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  return { values, errors, setErrors, handleChange, reset };
};
```

## Testing Hooks

### Using React Testing Library
```typescript
import { renderHook, act } from '@testing-library/react';
import { useFeature } from './useFeature';

describe('useFeature', () => {
  it('should fetch data on mount', async () => {
    const { result } = renderHook(() => useFeature());
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

## When to Create a New Hook
- Logic is reused across multiple components
- Component logic exceeds 50 lines
- State management becomes complex
- Side effects need to be isolated
- API interactions need to be shared

## Anti-Patterns to Avoid
- ❌ Not including dependencies in useEffect
- ❌ Calling hooks conditionally
- ❌ Calling hooks inside loops
- ❌ Using hooks in non-React functions
- ❌ Not cleaning up side effects
- ❌ Overusing hooks (creating hooks for simple logic)
