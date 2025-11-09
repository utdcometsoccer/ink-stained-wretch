# Component Development Instructions

## Overview
This file provides specific guidance for working with React components in the `src/components/` directory.

## Component Structure

### Standard Component Pattern
```typescript
import React from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  title: string;
  onAction: () => void;
  optional?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  title, 
  onAction, 
  optional 
}) => {
  // Component logic here
  
  return (
    <div className="component-name">
      {/* JSX here */}
    </div>
  );
};
```

## Key Components to Understand

### Authentication Components
- **AuthGuard**: Wrapper for protected routes, checks authentication state
- **LoginRegister**: Handles user authentication flows with MSAL

### Form Components
- **AuthorForm**: Main author profile editing form
- **BookForm**: Book entry and editing form
- **DomainRegistration**: Domain registration wizard with multi-step form

### Subscription Components
- **ChooseSubscription**: Display subscription plan options
- **Checkout**: Stripe checkout integration with embedded or redirect flows

### Layout Components
- **Container**: Responsive container with mobile optimization
- **Navbar**: Main navigation with authentication state awareness

## Best Practices for Components

### Props and State
- Always define props interfaces
- Use TypeScript strict mode
- Prefer controlled components over uncontrolled
- Use custom hooks for complex state logic

### Styling
- Use CSS modules (ComponentName.css) for component-specific styles
- Leverage Material-UI components and theme
- Ensure responsive design for mobile, tablet, and desktop
- Test with RTL languages for Arabic support

### Event Handlers
```typescript
// Good: Properly typed event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  // Handle change
};
```

### Error Boundaries
- Wrap route-level components with ErrorBoundary
- Provide meaningful fallback UI
- Log errors to Application Insights

### Accessibility
- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

## Common Patterns

### Loading States
```typescript
const [loading, setLoading] = React.useState(false);

if (loading) {
  return <CircularProgress />;
}
```

### Error Handling
```typescript
const [error, setError] = React.useState<string | null>(null);

if (error) {
  return <Alert severity="error">{error}</Alert>;
}
```

### Conditional Rendering
```typescript
// Good: Use ternary or logical operators
{isAuthenticated ? <AuthenticatedView /> : <LoginPrompt />}
{items.length > 0 && <ItemList items={items} />}
```

## Localization
- Always use translation keys from `useLocale` hook
- Never hardcode user-facing strings
- Update all locale files when adding new keys
```typescript
const { t } = useLocale();
<button>{t('common.submit')}</button>
```

## Testing Components
- Write unit tests for each component
- Test user interactions (clicks, form submissions)
- Test conditional rendering
- Mock API calls and external dependencies
- Verify accessibility attributes

## When to Create a New Component
- Component logic exceeds 200 lines
- Component serves a distinct purpose
- Component is reused in multiple places
- Component represents a logical UI unit
- Component has complex state management
