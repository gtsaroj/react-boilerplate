# Route Standardization Guide

## Overview

This guide outlines the standardized approach for managing routes in your CREquity application. The new system provides better organization, type safety, and maintainability.

## Key Benefits

- **Type Safety**: All routes are typed with TypeScript
- **Consistency**: Standardized route patterns and naming
- **Maintainability**: Centralized route management
- **Validation**: Built-in route validation and access control
- **Documentation**: Self-documenting route structure

## File Structure

```
src/routes/
├── types.ts              # Route type definitions
├── constants.ts          # Route constants and patterns
├── utils.ts              # Route utility functions
├── index.ts              # Central exports
├── routes.tsx            # Main route configuration
├── main/
│   └── main.route.tsx    # Public routes
├── dashboard/
│   ├── borrower.routes.tsx
│   ├── broker.routes.tsx
│   └── lender.route.tsx
├── onboarding/
│   └── onboarding.route.tsx
└── standardized-example.tsx  # Example implementation
```

## Migration Steps

### 1. Update Route Constants

Replace hardcoded route strings with constants:

```typescript
// Before
const path = '/borrower/dashboard/my-loans';

// After
import { ROUTES } from '@/routes';
const path = ROUTES.MY_LOANS('borrower');
```

### 2. Standardize Route Configuration

Update your route objects to use the new structure:

```typescript
// Before
'/borrower/dashboard': {
  element: <BorrowerHomePage />,
  requireAuth: true,
  roles: ['borrower']
}

// After
[ROUTES.DASHBOARD('borrower')]: {
  element: <BorrowerHomePage />,
  requireAuth: true,
  roles: [ROLES.BORROWER],
  layout: DashboardLayout,
  meta: {
    title: 'Borrower Dashboard - CREquity',
    description: 'Borrower dashboard overview'
  }
}
```

### 3. Use Route Utilities

Replace manual route manipulation with utility functions:

```typescript
// Before
const routeWithId = `/borrower/dashboard/my-loans/${loanId}`;

// After
import { RouteUtils } from '@/routes';
const routeWithId = RouteUtils.generateRouteWithId(
  ROUTES.MY_LOANS('borrower'), 
  loanId
);
```

### 4. Implement Route Validation

Add route validation to your components:

```typescript
import { routeValidation } from '@/routes';

const MyComponent = () => {
  const { userRole } = useAuth();
  const currentPath = useLocation().pathname;
  
  const validation = routeValidation.validateRoute(
    currentPath, 
    userRole, 
    routes
  );
  
  if (!validation.isValid) {
    return <ErrorPage error={validation.error} />;
  }
  
  return <div>Content</div>;
};
```

## Route Naming Conventions

### Public Routes
- Use descriptive names: `HOME`, `ABOUT`, `CONTACT`
- Keep them simple and memorable
- Use kebab-case for URLs

### Protected Routes
- Prefix with role: `DASHBOARD('role')`, `MY_LOANS('role')`
- Use descriptive suffixes: `_DETAILS`, `_CREATE`, `_EDIT`
- Maintain consistency across roles

### Dynamic Routes
- Use parameter placeholders: `:id`, `:role`, `:category`
- Generate with utility functions
- Validate parameters

## Best Practices

### 1. Route Organization

```typescript
// Group related routes
const borrowerRoutes = {
  [ROUTES.DASHBOARD('borrower')]: { ... },
  [ROUTES.MY_LOANS('borrower')]: { ... },
  [ROUTES.CREATE_LOAN('borrower')]: { ... },
};
```

### 2. Route Validation

```typescript
// Always validate route access
const canAccess = RouteUtils.validateRouteAccess(path, userRole);
if (!canAccess) {
  redirectTo('/unauthorized');
}
```

### 3. Route Metadata

```typescript
// Include SEO-friendly metadata
[ROUTES.ABOUT]: {
  element: <AboutPage />,
  meta: {
    title: 'About Us - CREquity',
    description: 'Learn about our mission and team'
  }
}
```

### 4. Lazy Loading

```typescript
// Use lazy loading for better performance
const LazyComponent = lazy(() => 
  import('@/pages/dashboard/borrower/home').then(m => ({ 
    default: m.BorrowerHomePage 
  }))
);
```

## Implementation Checklist

- [ ] Create route type definitions
- [ ] Define route constants
- [ ] Implement route utilities
- [ ] Update existing route configurations
- [ ] Add route validation middleware
- [ ] Update navigation components
- [ ] Add route metadata
- [ ] Test route access controls
- [ ] Update documentation
- [ ] Train team on new conventions

## Common Patterns

### Role-Based Routes
```typescript
const generateRoleRoutes = (role: string) => ({
  [ROUTES.DASHBOARD(role)]: { ... },
  [ROUTES.MY_LOANS(role)]: { ... },
  [ROUTES.SETTINGS(role)]: { ... },
});
```

### Dynamic Route Generation
```typescript
const createDynamicRoute = (baseRoute: string, params: Record<string, string>) => {
  return RouteUtils.generateRouteWithParams(baseRoute, params);
};
```

### Route Guards
```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const { userRole } = useAuth();
  
  if (!RouteUtils.validateRouteAccess(currentPath, userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

## Troubleshooting

### Common Issues

1. **Route not found**: Check route constants and ensure they match
2. **Access denied**: Verify user role and route permissions
3. **Type errors**: Ensure all routes use proper TypeScript types
4. **Performance**: Use lazy loading for large route trees

### Debug Tools

```typescript
// Route debugging utility
const debugRoute = (path: string) => {
  console.log('Route Type:', RouteUtils.getRouteType(path));
  console.log('Extracted Role:', RouteUtils.extractRoleFromPath(path));
  console.log('Extracted ID:', RouteUtils.extractIdFromPath(path));
  console.log('Breadcrumbs:', RouteUtils.generateBreadcrumbs(path));
};
```

## Conclusion

This standardization provides a robust foundation for route management. It improves code quality, reduces bugs, and makes the application more maintainable. Follow the migration steps gradually to ensure a smooth transition.
