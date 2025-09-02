# React Boilerplate Development Guide

## 📁 Project Structure & Naming Conventions

### File Naming Pattern
All files follow the pattern: `name.type.ts` or `name.type.tsx`

**Examples:**
- `user.component.tsx` - React component
- `user.service.ts` - Service/API functions
- `user.routes.ts` - Route definitions
- `user.hook.ts` - Custom React hooks
- `user.utils.ts` - Utility functions

### Folder Structure
```
src/
├── @types/           # TypeScript type definitions
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, etc.)
│   └── [feature]/   # Feature-specific components
├── pages/           # Page components
│   └── [feature]/   # Feature pages
├── layouts/         # Layout components
├── routes/          # Route definitions
├── services/        # API services
├── hooks/           # Custom React hooks
├── store/           # State management (Redux)
├── utils/           # Utility functions
├── helpers/         # Helper functions
└── common/          # Common components (Loader, Error, etc.)
```

## 🛠️ Core Technologies

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query** for server state management
- **Redux Toolkit** for client state management
- **React Router** for routing
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

## 📋 Development Guidelines

### 1. Component Development

**File Structure:**
```
src/pages/user/
├── user.component.tsx    # Main component
├── user.service.ts       # API calls
├── user.hook.ts          # Custom hooks
└── user.routes.ts        # Route definition
```

**Component Example:**
```tsx
// user.component.tsx
import React from 'react';
import { useUserData } from './user.hook';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/common/loader/loading';
import { EmptyState } from '@/common/empty/emptyState';
import { AppErrorBoundary } from '@/common/error/error';

const UserComponent: React.FC = () => {
  const { data, isLoading, error } = useUserData();

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState title="Error" description={error.message} />;
  if (!data?.length) return <EmptyState title="No users found" description="Create your first user to get started" />;

  return (
    <div>
      <h1>Users: {data.length}</h1>
      <Button>Add User</Button>
    </div>
  );
};

// Wrap with error boundary
const UserComponentWithErrorBoundary: React.FC = () => (
  <AppErrorBoundary>
    <UserComponent />
  </AppErrorBoundary>
);

export default UserComponentWithErrorBoundary;
```

### 2. Service Layer with AsyncHandler

**Request Methods:**
- `globalRequest` - Simple axios instance for basic API calls
- `makeRequest` - Enhanced axios instance with token refresh logic and interceptors

**Service Example:**
```tsx
// user.service.ts
import { globalRequest } from '@/globalRequest';
import { makeRequest } from '@/makeRequest';
import { asyncHandler } from '@/helpers/asyncHandler';
import { User } from '@/@types/model';

export const userService = {
  getUsers: asyncHandler(async (): Promise<User[]> => {
    const response = await globalRequest({
      method: 'get',
      url: '/users'
    });
    return response.data;
  }),

  createUser: asyncHandler(async (userData: Partial<User>): Promise<User> => {
    const response = await globalRequest({
      method: 'post',
      url: '/users',
      data: userData
    });
    return response.data;
  }),

  updateUser: asyncHandler(async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await globalRequest({
      method: 'put',
      url: `/users/${id}`,
      data: userData
    });
    return response.data;
  }),

  deleteUser: asyncHandler(async (id: string): Promise<void> => {
    await globalRequest({
      method: 'delete',
      url: `/users/${id}`
    });
  }),

  // Use makeRequest for authenticated endpoints (with token refresh)
  getUserProfile: asyncHandler(async (): Promise<User> => {
    const response = await makeRequest({
      method: 'get',
      url: '/user/profile'
    });
    return response.data;
  })
};
```

### 3. React Query Integration

**Custom Hook Example:**
```tsx
// user.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from './user.service';
import { toaster } from '@/utils/toast/toast';

export const useUserData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toaster({ 
        message: 'User created successfully', 
        icon: 'success',
        className: 'bg-green-50'
      });
    },
    onError: (error) => {
      toaster({ 
        message: error.message, 
        icon: 'error',
        className: 'bg-red-50'
      });
    }
  });
};
```

### 4. Route Management

**Route Definition:**
```tsx
// user.routes.ts
import { lazy } from "react";

const UserList = lazy(() => import("@/pages/user/user.component").then(component => ({ default: component.default })));

export const userRoutes = {
  "/users": {
    element: <UserList />,
    requireAuth: true,
    isAccessToAnyOne: false
  },
  "/users/:id": {
    element: <UserList />,
    requireAuth: true,
    isAccessToAnyOne: false
  }
};
```

**Main Routes Integration:**
```tsx
// routes/routes.tsx
import { userRoutes } from '@/pages/user/user.routes';

export const routers = {
  ...userRoutes,
  // other routes
};
```

### 5. Layout Management

**Folder-based Layout Structure:**
```
src/layouts/
├── base/
│   └── baseLayout.tsx      # Main layout with nav/footer
├── auth/
│   └── authLayout.tsx      # Auth pages layout
└── dashboard/
    └── dashboardLayout.tsx # Dashboard layout
```

**Layout Example:**
```tsx
// layouts/dashboard/dashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from '@/components/sidebar/sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
```

### 6. Common Components

**Available Common Components:**
```tsx
// Loading components
import { LoadingSpinner, LoadingFallback } from '@/common/loader/loading';

// Error handling
import { ErrorFallback, AppErrorBoundary } from '@/common/error/error';

// Empty states
import { EmptyState } from '@/common/empty/emptyState';

// Pagination
import { Pagination } from '@/common/pagination/pagination';
```

**Usage Examples:**
```tsx
// Loading states
<LoadingSpinner size="sm" />  // Small spinner
<LoadingSpinner size="md" />  // Medium spinner (default)
<LoadingSpinner size="lg" />  // Large spinner
<LoadingFallback />           // Full screen loading

// Error boundaries
<AppErrorBoundary>
  <YourComponent />
</AppErrorBoundary>

// Empty states
<EmptyState 
  title="No data found"
  description="Create your first item to get started"
  action={<Button>Create Item</Button>}
/>

// Custom empty state with icon
<EmptyState 
  title="No users"
  description="Add users to your team"
  icon={<UserIcon className="h-12 w-12 text-gray-400" />}
/>
```

### 7. Toast Notifications

**Usage Examples:**
```tsx
import { toaster } from '@/utils/toast/toast';

// Success notification
toaster({
  message: 'Operation completed successfully',
  icon: 'success',
  className: 'bg-green-50'
});

// Error notification
toaster({
  message: 'Something went wrong',
  icon: 'error',
  className: 'bg-red-50'
});

// Loading notification
const loadingToast = toaster({
  message: 'Processing...',
  icon: 'loading'
});

// Dismiss loading
toast.dismiss(loadingToast);
```

### 8. Environment Variables

**Setup:**
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=My React App
```

**Usage:**
```tsx
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### 9. TypeScript Types

**Global Namespace Pattern:**
All types are defined in `.d.ts` files using global namespaces for easy access throughout the application.

**Type Definitions:**
```tsx
// @types/auth.d.ts
declare namespace Auth {
  interface AuthState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    token: string;
    refreshToken: string;
    role: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  }
}

// @types/model.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// @types/common.d.ts
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  status: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Usage Examples:**
```tsx
// Using global namespace types
const authState: Auth.AuthState = {
  name: 'John Doe',
  email: 'john@example.com',
  // ... other properties
};

// Using exported interfaces
const user: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01'
};

// API response typing
const response: ApiResponse<User[]> = await userService.getUsers();
```

## 🚀 Best Practices

### Code Reusability & DRY Principles
- **Create reusable components** in `@/components/ui/` for common UI elements
- **Extract common logic** into custom hooks (prefix with `use`)
- **Use common components** from `@/common/` folder (LoadingSpinner, EmptyState, etc.)
- **Share utility functions** in `@/utils/` and `@/helpers/`
- **Avoid code duplication** - extract repeated patterns into reusable functions
- **Use composition over inheritance** - build complex components from simple ones

### Performance Optimization
- **React.memo** for expensive components that receive stable props
- **useMemo** for expensive calculations that don't change often
- **useCallback** for functions passed as props to prevent child re-renders
- **Lazy loading** for routes and heavy components
- **Virtual scrolling** for large lists
- **Image optimization** with proper sizing and lazy loading
- **Bundle splitting** with dynamic imports

### Component Design
- Keep components focused (Single Responsibility Principle)
- Use `useEffect`, `useMemo`, `useCallback` properly to avoid re-renders
- Prefix custom hooks with `use` (e.g., `useUserData`)
- **Extract business logic** into custom hooks
- **Compose components** instead of creating monolithic ones

### State Management
- Use React Query for server state
- Use Redux Toolkit for client state
- Keep state as close to where it's used as possible
- **Avoid prop drilling** - use context or state management when needed
- **Normalize data** in Redux store for better performance

### Error Handling
- Wrap all API calls with `asyncHandler`
- Use custom error boundaries for component errors
- Display user-friendly error messages via toast
- **Centralize error handling** in interceptors and error boundaries

### Performance Monitoring
- **Use React DevTools Profiler** to identify performance bottlenecks
- **Monitor bundle size** with build analysis tools
- **Implement proper loading states** to improve perceived performance
- **Use Suspense** for better loading UX

## 🔧 Reusability & Performance Examples

### Reusable Custom Hook
```tsx
// hooks/useApiData.ts
import { useQuery } from '@tanstack/react-query';
import { asyncHandler } from '@/helpers/asyncHandler';

export const useApiData = <T>(
  queryKey: string[],
  apiCall: () => Promise<T>,
  options?: { enabled?: boolean; staleTime?: number }
) => {
  return useQuery({
    queryKey,
    queryFn: asyncHandler(apiCall),
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

// Usage
const { data, isLoading, error } = useApiData(
  ['users'],
  () => userService.getUsers(),
  { staleTime: 10 * 60 * 1000 }
);
```

### Optimized Component with Memoization
```tsx
// components/UserList.tsx
import React, { useMemo, useCallback } from 'react';
import { User } from '@/@types/model';

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  searchTerm: string;
}

const UserList = React.memo<UserListProps>(({ users, onUserSelect, searchTerm }) => {
  // Memoize filtered users to avoid recalculation
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Memoize callback to prevent child re-renders
  const handleUserClick = useCallback((user: User) => {
    onUserSelect(user);
  }, [onUserSelect]);

  return (
    <div>
      {filteredUsers.map(user => (
        <UserItem 
          key={user.id} 
          user={user} 
          onClick={handleUserClick}
        />
      ))}
    </div>
  );
});
```

### Reusable Service Pattern
```tsx
// services/base/baseService.ts
import { globalRequest } from '@/globalRequest';
import { asyncHandler } from '@/helpers/asyncHandler';

export const createBaseService = <T>(endpoint: string) => ({
  getAll: asyncHandler(async (): Promise<T[]> => {
    const response = await globalRequest({
      method: 'get',
      url: endpoint
    });
    return response.data;
  }),

  getById: asyncHandler(async (id: string): Promise<T> => {
    const response = await globalRequest({
      method: 'get',
      url: `${endpoint}/${id}`
    });
    return response.data;
  }),

  create: asyncHandler(async (data: Partial<T>): Promise<T> => {
    const response = await globalRequest({
      method: 'post',
      url: endpoint,
      data
    });
    return response.data;
  }),

  update: asyncHandler(async (id: string, data: Partial<T>): Promise<T> => {
    const response = await globalRequest({
      method: 'put',
      url: `${endpoint}/${id}`,
      data
    });
    return response.data;
  }),

  delete: asyncHandler(async (id: string): Promise<void> => {
    await globalRequest({
      method: 'delete',
      url: `${endpoint}/${id}`
    });
  })
});

// Usage
export const userService = createBaseService<User>('/users');
export const productService = createBaseService<Product>('/products');
```

## 📝 Commit Messages

Use clear, descriptive commit messages:
```
feat: add user management system
fix: correct mobile menu bug
chore: update dependencies
docs: update development guide
refactor: improve error handling
```

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Preview
npm run preview
```

## 📦 Key Dependencies

- `@tanstack/react-query` - Server state management
- `@reduxjs/toolkit` - Client state management
- `react-router` - Routing
- `axios` - HTTP client
- `react-hot-toast` - Notifications
- `tailwindcss` - Styling
- `lucide-react` - Icons

This boilerplate provides a solid foundation for building scalable React applications with modern best practices.
