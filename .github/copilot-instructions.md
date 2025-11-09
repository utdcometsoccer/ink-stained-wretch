# GitHub Copilot Instructions for Ink Stained Wretch

## Project Overview

Ink Stained Wretch is a modular, type-safe author platform built with React 19, TypeScript, and Vite. The platform enables writers to manage their digital presence, publish content, and monetize through subscription services with integrated Stripe payment processing.

## Tech Stack

### Core Technologies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Strict typing enabled for all code
- **Vite 7**: Fast build tool with HMR
- **Material-UI (MUI)**: Component library for UI
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing utilities

### Backend Integration
- **Microsoft Entra ID (MSAL)**: OAuth 2.0 authentication
- **Stripe**: Payment processing and subscription management
- **Azure Functions**: Serverless backend endpoints
- **Azure Blob Storage**: Image and asset storage
- **Application Insights**: Telemetry and monitoring

### Key Libraries
- `@azure/msal-react`: Microsoft authentication
- `@stripe/react-stripe-js`: Stripe integration
- `@mui/material` & `@mui/icons-material`: UI components
- `axios`: HTTP client for API calls
- `jsdom`: DOM testing environment

## Project Architecture

### Component Structure
```
src/
├── components/          # React components by feature
│   ├── Checkout/       # Stripe checkout flow
│   ├── ChooseSubscription/ # Subscription plans
│   ├── BookList/       # Book catalog management
│   ├── ImageManager/   # Image upload/management
│   ├── LoginRegister/  # Authentication UI
│   └── ...
├── hooks/              # Custom React hooks for business logic
├── reducers/           # State management with typed reducers
├── services/           # API clients and external integrations
├── types/              # TypeScript type definitions
├── locales/            # i18n JSON files (en-us, fr-ca, es-mx, ar-eg, zh-tw)
└── contexts/           # React context providers
```

### State Management
- Use **reducers** with TypeScript discriminated unions for actions
- Custom hooks encapsulate component logic and state
- Context providers for global state (authentication, localization)

### API Integration Pattern
```typescript
// All APIs use async/await with proper error handling
// Use axios for HTTP requests with bearer token authentication
const response = await axios.get(url, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Code Style & Conventions

### TypeScript Guidelines
- **Strict Mode**: All code must pass `strict: true` TypeScript checks
- **Type Definitions**: Define types in `src/types/` directory
- **Interfaces over Types**: Prefer interfaces for object shapes
- **No `any`**: Avoid `any` type; use `unknown` when type is uncertain
- **Generics**: Use generics for reusable components and functions

### React Patterns
- **Functional Components**: All components must be functional (no class components)
- **TypeScript with React.FC**: Use `React.FC<Props>` or explicit return types
- **Custom Hooks**: Extract complex logic into custom hooks (prefix with `use`)
- **Props Interfaces**: Always define props with interfaces, e.g., `ComponentNameProps`

### Component Structure
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  // Component logic using hooks
  return (
    // JSX
  );
};
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AuthorMainForm`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAppLogic`)
- **Types/Interfaces**: PascalCase (e.g., `AuthorFormAction`)
- **Files**: Match component/hook name (e.g., `AuthorMainForm.tsx`)
- **CSS Modules**: Component name + `.css` (e.g., `AuthorMainForm.css`)

### State Management Pattern
```typescript
// Reducer pattern with discriminated unions
type Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Data };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    // ...
  }
};
```

## Internationalization (i18n)

### Locale Support
- **Primary**: `en-us` (English - United States)
- **Supported**: `fr-ca`, `es-mx`, `ar-eg` (RTL), `zh-tw`

### Translation Pattern
```typescript
// Use useLocale hook for translations
const { t } = useLocale();

// Access nested translation keys
<button>{t('common.save')}</button>
<h1>{t('subscription.plans.starter')}</h1>
```

### Adding Translations
1. Add key to `src/types/LocalizedText.ts`
2. Update all locale JSON files in `src/locales/`
3. Use consistent key structure across all languages
4. Test with RTL languages (Arabic)

## Authentication

### MSAL Pattern
```typescript
// Use MSAL hooks from @azure/msal-react
import { useMsal } from '@azure/msal-react';

const { instance, accounts } = useMsal();
const account = accounts[0];

// Acquire token for API calls
const token = await instance.acquireTokenSilent({
  scopes: ['api://app-id/.default'],
  account
});
```

### Protected Routes
- Wrap components with `AuthGuard` for protected routes
- Check authentication state before API calls
- Handle token expiration and refresh automatically

## API Clients

### Service Layer Pattern
```typescript
// All API clients in src/services/
// Export typed functions for API operations
export const fetchSubscriptionPlans = async (
  token: string,
  page: number = 1
): Promise<SubscriptionPlan[]> => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page }
  });
  return response.data.plans;
};
```

### Error Handling
- Always handle errors with try/catch
- Provide user-friendly error messages
- Log errors to Application Insights
- Use error boundaries for component-level errors

## Testing

### Test Structure
```typescript
// Use Vitest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testing Guidelines
- **Unit Tests**: Test components, hooks, and reducers in isolation
- **Integration Tests**: Test component interactions and data flow
- **Coverage**: Maintain test coverage for critical paths
- **Mocking**: Mock API calls and external dependencies
- **Accessibility**: Test with screen readers and keyboard navigation

### Running Tests
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm run test:coverage # Generate coverage report
```

## Stripe Integration

### Payment Flow
1. User selects subscription plan
2. Frontend creates checkout session via backend API
3. Redirect to Stripe Checkout or use embedded form
4. Handle success/cancel callbacks
5. Webhook processes subscription events

### Stripe Components
```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);

// Wrap components with Elements provider
<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>
```

## Environment Variables

### Naming Convention
- All frontend variables must start with `VITE_`
- Add type declarations to `src/vite-env.d.ts`

### Key Variables
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `VITE_ENTRA_CLIENT_ID`: Microsoft Entra client ID
- `VITE_ENTRA_TENANT_ID`: Azure tenant ID
- `VITE_APPLICATION_INSIGHTS_CONNECTION_STRING`: App Insights

## Build & Development

### Scripts
```bash
npm run dev      # Development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint code quality check
npm test         # Run tests
```

### Build Configuration
- Vite bundles for production with tree-shaking
- TypeScript compilation happens before Vite build
- ESLint enforces code quality standards

## Common Patterns to Follow

### Image Management
- Use `ImageManager` component for uploads
- Respect tier-based upload limits
- Handle file size validation
- Display upload progress

### Form Handling
- Use controlled components with state
- Validate inputs before submission
- Display validation errors inline
- Disable submit button during processing

### Navigation
- Use `Navbar` component for consistent navigation
- Dynamic navigation based on authentication state
- Responsive mobile menu

### Error Handling
- Use `ErrorBoundary` component at route level
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI

## Performance Considerations

- **Code Splitting**: Use React.lazy for route-based splitting
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Image Optimization**: Compress images, use appropriate formats
- **Bundle Size**: Keep bundle size minimal, avoid unnecessary dependencies

## Security Best Practices

- **No Secrets in Code**: Never commit API keys or secrets
- **Token Management**: Store tokens securely, refresh before expiration
- **Input Validation**: Validate and sanitize all user inputs
- **XSS Prevention**: Use React's built-in XSS protection
- **CORS**: Configure CORS properly on backend
- **HTTPS Only**: Always use HTTPS in production

## When Suggesting Code

1. **Follow TypeScript strict mode** - All code must be fully typed
2. **Use existing patterns** - Match the patterns in the codebase
3. **Import from correct paths** - Use absolute imports for src/ files
4. **Include error handling** - Always handle errors appropriately
5. **Add types for props** - Define interfaces for all component props
6. **Use Material-UI components** - Leverage MUI for consistent UI
7. **Respect i18n** - Use translation keys for all user-facing strings
8. **Test your suggestions** - Ensure code would pass linting and type checks
9. **Consider accessibility** - Include ARIA labels and semantic HTML
10. **Document complex logic** - Add JSDoc comments for complex functions

## Anti-Patterns to Avoid

- ❌ Using `any` type in TypeScript
- ❌ Class components (use functional components)
- ❌ Inline styles (use CSS modules or MUI styling)
- ❌ Direct DOM manipulation (use React refs sparingly)
- ❌ Hardcoded strings (use i18n translation keys)
- ❌ Unhandled promises (always catch errors)
- ❌ Missing dependencies in useEffect (add to dependency array)
- ❌ Mutating state directly (use immutable updates)

## Additional Resources

- [Project README](../README.md) - Comprehensive project documentation
- [Stripe Integration Guide](../STRIPE_CHECKOUT_AZURE.md) - Stripe setup details
- [Author API Docs](../AuthorAPI.md) - Author API documentation
- [Subscription API Docs](../SubscriptionPlanAPI.md) - Subscription management
- [Domain Registration API](../DomainRegistrationAPI.md) - Domain management
