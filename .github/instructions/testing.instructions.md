# Testing Instructions

## Overview
Testing in this project uses Vitest and React Testing Library to ensure code quality and prevent regressions.

## Test File Structure

### Standard Test Pattern
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<ComponentName />);
    const button = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Test Organization

### File Naming
- Test files should be named `*.test.ts` or `*.test.tsx`
- Place test files in the `tests/` directory or colocated with source files
- Use descriptive test names that explain what is being tested

### Test Structure (AAA Pattern)
```typescript
it('should do something specific', () => {
  // Arrange - Set up test data and conditions
  const mockData = { id: '1', name: 'Test' };
  
  // Act - Perform the action being tested
  const result = processData(mockData);
  
  // Assert - Verify the expected outcome
  expect(result).toEqual(expectedResult);
});
```

## Testing Components

### Rendering Tests
```typescript
import { render, screen } from '@testing-library/react';

it('should render with props', () => {
  render(<MyComponent title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### Testing User Interactions
```typescript
import { fireEvent } from '@testing-library/react';

it('should call onClick when button is clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  
  fireEvent.click(screen.getByText('Click Me'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Form Inputs
```typescript
import { fireEvent } from '@testing-library/react';

it('should update input value', () => {
  render(<LoginForm />);
  const input = screen.getByLabelText(/username/i);
  
  fireEvent.change(input, { target: { value: 'testuser' } });
  
  expect(input).toHaveValue('testuser');
});
```

### Testing Async Operations
```typescript
import { waitFor } from '@testing-library/react';

it('should load data asynchronously', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('Data Loaded')).toBeInTheDocument();
  });
});
```

## Testing Hooks

### Using renderHook
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Testing Hooks with Dependencies
```typescript
it('should refetch data when dependency changes', async () => {
  const { result, rerender } = renderHook(
    ({ id }) => useFetchData(id),
    { initialProps: { id: '1' } }
  );
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
  
  rerender({ id: '2' });
  
  await waitFor(() => {
    expect(result.current.data?.id).toBe('2');
  });
});
```

## Mocking

### Mocking Axios
```typescript
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  it('should fetch data', async () => {
    const mockData = { id: '1', name: 'Test' };
    mockedAxios.get.mockResolvedValue({ data: mockData });
    
    const result = await fetchData();
    
    expect(result).toEqual(mockData);
  });
});
```

### Mocking Modules
```typescript
vi.mock('./services/api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: '1', name: 'Test' }),
}));
```

### Mocking MSAL (Authentication)
```typescript
import { useMsal } from '@azure/msal-react';

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
}));

describe('AuthenticatedComponent', () => {
  it('should render for authenticated user', () => {
    (useMsal as jest.Mock).mockReturnValue({
      instance: {},
      accounts: [{ username: 'test@example.com' }],
      inProgress: 'none',
    });
    
    render(<AuthenticatedComponent />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
});
```

### Mocking Environment Variables
```typescript
const originalEnv = import.meta.env;

beforeEach(() => {
  import.meta.env = {
    ...originalEnv,
    VITE_API_BASE_URL: 'https://test-api.example.com',
  };
});

afterEach(() => {
  import.meta.env = originalEnv;
});
```

## Testing Reducers

### Testing State Updates
```typescript
import { reducer, initialState } from './myReducer';

describe('myReducer', () => {
  it('should handle SET_LOADING action', () => {
    const action = { type: 'SET_LOADING' as const, payload: true };
    const newState = reducer(initialState, action);
    
    expect(newState.loading).toBe(true);
  });

  it('should handle SET_DATA action', () => {
    const mockData = { id: '1', name: 'Test' };
    const action = { type: 'SET_DATA' as const, payload: mockData };
    const newState = reducer(initialState, action);
    
    expect(newState.data).toEqual(mockData);
  });
});
```

## Accessibility Testing

### Testing ARIA Attributes
```typescript
it('should have proper ARIA labels', () => {
  render(<LoginForm />);
  const input = screen.getByRole('textbox', { name: /username/i });
  
  expect(input).toHaveAttribute('aria-label', 'Username');
});
```

### Testing Keyboard Navigation
```typescript
it('should be navigable with keyboard', () => {
  render(<NavigationMenu />);
  const firstLink = screen.getAllByRole('link')[0];
  
  firstLink.focus();
  expect(firstLink).toHaveFocus();
  
  fireEvent.keyDown(firstLink, { key: 'Tab' });
  expect(screen.getAllByRole('link')[1]).toHaveFocus();
});
```

## Snapshot Testing

### Component Snapshots
```typescript
it('should match snapshot', () => {
  const { container } = render(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```

**Note**: Use snapshots sparingly. Prefer explicit assertions over snapshots.

## Test Coverage

### Running Coverage
```bash
npm run test:coverage
```

### Coverage Goals
- Aim for 80%+ code coverage
- Focus on critical paths and business logic
- Don't test for the sake of coverage
- Test behavior, not implementation details

## Common Testing Patterns

### Testing Error States
```typescript
it('should display error message on failure', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network error'));
  
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Loading States
```typescript
it('should show loading indicator', () => {
  render(<DataComponent />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### Testing Conditional Rendering
```typescript
it('should render different content based on auth state', () => {
  const { rerender } = render(<Component isAuthenticated={false} />);
  expect(screen.getByText('Please log in')).toBeInTheDocument();
  
  rerender(<Component isAuthenticated={true} />);
  expect(screen.getByText('Welcome back')).toBeInTheDocument();
});
```

## Performance Testing

### Testing with React.lazy
```typescript
it('should lazy load component', async () => {
  render(<LazyWrapper />);
  
  await waitFor(() => {
    expect(screen.getByText('Lazy Loaded')).toBeInTheDocument();
  });
});
```

## Best Practices

### DO:
- ✅ Test user-visible behavior
- ✅ Use semantic queries (getByRole, getByLabelText)
- ✅ Wait for async operations with waitFor
- ✅ Mock external dependencies
- ✅ Keep tests simple and focused
- ✅ Write descriptive test names
- ✅ Clean up after tests

### DON'T:
- ❌ Test implementation details
- ❌ Use implementation-specific queries (getByTestId unless necessary)
- ❌ Make tests dependent on each other
- ❌ Forget to clean up side effects
- ❌ Over-mock (only mock external dependencies)
- ❌ Write tests that test the testing library

## Debugging Tests

### Using debug()
```typescript
import { render, screen } from '@testing-library/react';

it('debug test', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints the DOM tree
  screen.debug(); // Alternative way
});
```

### Using waitFor with longer timeout
```typescript
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 3000 }
);
```

## Test Organization Tips

### Grouping Related Tests
```typescript
describe('MyComponent', () => {
  describe('when authenticated', () => {
    it('should show user menu', () => {
      // Test
    });
  });

  describe('when not authenticated', () => {
    it('should show login button', () => {
      // Test
    });
  });
});
```

### Shared Setup
```typescript
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LocalizationProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </LocalizationProvider>
  );
};
```

## When to Write Tests

- **Always**: For bug fixes (write regression test first)
- **Always**: For new features (test main functionality)
- **Usually**: For complex business logic
- **Sometimes**: For simple presentational components
- **Rarely**: For third-party library wrappers (unless adding logic)

## Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode for development
npm run test:coverage # Generate coverage report
npm test -- MyComponent # Run specific test file
```
