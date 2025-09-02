# React App Boilerplate

A modern React application boilerplate built with TypeScript, Vite, and Tailwind CSS.

## Features

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React 19** - Latest React with concurrent features
- 🔷 **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧭 **React Router** - Client-side routing
- 🔄 **React Query** - Data fetching and caching
- 🎯 **ESLint** - Code linting and formatting
- 🔔 **React Hot Toast** - Beautiful notifications
- 🎨 **Radix UI** - Accessible component primitives
- 📱 **Responsive Design** - Mobile-first approach

## Quick Start

1. **Clone or copy this boilerplate**
   ```bash
   # If using as template
   npx create-react-app my-app --template typescript
   # Or copy the files manually
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── common/           # Shared components (loading, error, etc.)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components
│   ├── nav/         # Navigation components
│   └── footer/      # Footer components
├── hooks/           # Custom React hooks
├── layouts/         # Layout components
├── pages/           # Page components
├── routes/          # Routing configuration
├── services/        # API services
├── utils/           # Utility functions
└── helpers/         # Helper functions
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_KEY=your_api_key_here
VITE_APP_NAME=React App
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route to `src/routes/routes.tsx`
3. Import and use the component

## Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Export from `src/components/index.ts`
3. Import and use in your pages

## Customization

- **Styling**: Modify `src/index.css` for global styles
- **Theme**: Update Tailwind config for custom theme
- **Components**: Add new UI components in `src/components/ui/`
- **API**: Configure API service in `src/services/api/`

## Best Practices

- Use TypeScript for all new files
- Follow the existing folder structure
- Use the provided UI components
- Implement proper error handling
- Add loading states for async operations
- Use React Query for data fetching
- Follow the naming conventions

## License

MIT
