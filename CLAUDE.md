# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SparkInAI is a Vue 3 + TypeScript SaaS application for AI-powered image and video generation. The app includes authentication, payment processing (Alipay, WeChat, Stripe), and content generation features for e-commerce product images.

## Development Commands

### Running the Application
```bash
pnpm dev          # Start dev server with mock API (port 19520)
pnpm prod         # Start dev server in production mode
pnpm preview      # Preview production build
```

### Building
```bash
pnpm build        # Type check + production build
pnpm build-only   # Build without type checking
pnpm type-check   # Run TypeScript compiler check
```

### Code Quality
```bash
pnpm lint         # Run all linters (oxlint + eslint)
pnpm format       # Format code with Prettier
```

### Testing
```bash
pnpm test:e2e     # Run Playwright E2E tests
```

### Adding UI Components
Use shadcn-vue for new UI components:
```bash
pnpm dlx shadcn-vue@latest add [component-name]
```

## Architecture Overview

### Directory Structure

- **`src/components/`** - Reusable Vue components
  - `ui/` - shadcn-vue UI library components (24+ components)
  - Custom components: `LoginForm.vue`, `SignupForm.vue`, `OTPForm.vue`, `UserPlanBadge.vue`

- **`src/composables/`** - Vue 3 Composition API hooks for state management
  - `useUser.ts` - User authentication state
  - `useUserData.ts` - Current user data and credit options
  - `useImages.ts` - Image data management
  - `useVideos.ts` - Video data management

- **`src/layouts/`** - Layout components
  - `AppLayout.vue` - Main authenticated app layout with sidebar and header
  - `components/header/` - AppHeader with breadcrumbs
  - `components/sidebar/` - Navigation sidebar components

- **`src/router/`** - Vue Router configuration
  - `index.ts` - Router instance
  - `routes.ts` - Route definitions with `menuConfig` for dynamic menu generation

- **`src/services/`** - API service layer (currently returns mock data)
  - `auth.ts` - Login, registration, OAuth
  - `user.ts` - User data and credit options
  - `image.ts` - Image retrieval
  - `imageGeneration.ts` - AI image generation and product analysis
  - `video.ts` - Video operations
  - `payment.ts` - Payment processing

- **`src/types/`** - TypeScript type definitions
  - `index.ts` - Global interfaces (User, Video, ImageGeneration, CreditOption)

- **`src/views/`** - Page components
  - `landing/`, `login/`, `register/`, `pricing/`, `payment/` - Public pages
  - `app/` - Authenticated pages (dashboard, image-generation, video-generation, user-center)

- **`mock/`** - Mock API server using vite-plugin-mock-dev-server
  - `*.mock.ts` - Mock endpoints for development

### Routing Structure

Routes are organized hierarchically:
- **Standalone routes** (no layout): `/`, `/login`, `/register`, `/pricing`, `/payment/*`
- **App routes** (with AppLayout): `/app/*` - All authenticated pages

The `menuConfig` array in `routes.ts` drives both the sidebar navigation and breadcrumb generation. Route metadata includes:
- `title` - Display name
- `icon` - Lucide icon name
- `badge` - Optional badge text
- `showInMenu` - Whether to show in sidebar
- `showInBreadcrumb` - Whether to show in breadcrumb trail

### State Management

The project uses a **hybrid approach**:
- **Pinia** is installed but primarily used through composables
- **Composables** (`useUserData`, `useImages`, `useVideos`) handle state and data fetching
- This pattern combines Composition API reactivity with Pinia's store capabilities

### API Integration

**Development Mode:**
- Mock server enabled via `VITE_MOCK_DEV_SERVER=true` in `.env.development`
- All API calls to `/api/*` are intercepted by mock server
- Mock definitions in `mock/*.mock.ts` files

**Production Mode:**
- Mock server disabled
- Services in `src/services/` should be updated to make real API calls
- Base URL: `VITE_API_BASE_URL=/api`

**Service Pattern:**
Services currently return mock data with comments indicating where real API calls should go:
```typescript
// TODO: Replace with actual API call
// return api.post('/auth/login', { email, password })
return Promise.resolve({ token: 'mock-token', user: mockUser })
```

### UI Component Library

**shadcn-vue** (based on Reka UI) is the primary UI library:
- Components located in `src/components/ui/`
- Configuration in `components.json`
- Style: "new-york"
- Base color: "neutral"
- Icon library: Lucide Vue Next
- Tailwind CSS v4 with CSS variables

**Adding new components:**
```bash
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add dialog
```

### Auto-imports

The following are auto-imported (no explicit imports needed):
- Vue 3 composition functions (`ref`, `computed`, `watch`, etc.)
- VueUse utilities
- Pinia functions
- Vue Router functions (`useRouter`, `useRoute`)

Type definitions are auto-generated in `auto-imports.d.ts`.

## Key Configuration Files

### vite.config.ts
- Base path: `VITE_APP_BASE_PATH`
- Dev server port: `VITE_APP_PORT=19520`
- Path alias: `@` → `./src`
- Mock server enabled when `VITE_MOCK_DEV_SERVER=true`
- Build output organized by asset type (js, img, media, fonts)

### Environment Files
- `.env` - Base configuration
- `.env.development` - Dev mode (mock server enabled)
- `.env.production` - Production mode (mock server disabled)

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- Source maps enabled
- Node version: ^20.19.0 || >=22.12.0

## Development Guidelines

### When Adding API Calls
Per README.md: Use mock implementations for API calls. Services should return Promises with mock data during development.

### When Adding UI Components
Per README.md: Prioritize shadcn-vue component library. Use `pnpm dlx shadcn-vue@latest add [component]` to install new components.

### Route Configuration
When adding new routes:
1. Add route definition in `src/router/routes.ts`
2. Update `menuConfig` if the route should appear in navigation
3. Set appropriate metadata (title, icon, showInMenu, showInBreadcrumb)
4. Use lazy loading: `component: () => import('@/views/...')`

### Component Organization
- Place reusable components in `src/components/`
- Place page-specific components in `src/views/[page]/components/`
- Use shadcn-vue components from `src/components/ui/`
- Create composables for shared state logic in `src/composables/`

### Styling
- Use Tailwind CSS utility classes
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Follow shadcn-vue component patterns for consistency

## Application Routes

Key routes from README.md:
- `/` - Landing page
- `/login` - Login page
- `/app/dashboard` - Main dashboard (authenticated)
- `/app/image-generation` - Image generation page
- `/pricing` - Pricing page
- `/payment/checkout` - Payment confirmation
- `/payment/result` - Payment result
- `/app/user-center` - User center

## Features

### Payment Integration
- Supports Alipay, WeChat Pay, and Stripe
- Flow: Pricing page → Payment confirmation → Payment processing → Payment result
- Order history and subscription status in user center

### Image Generation
- Upload up to 5 product images
- AI analyzes product information
- Generates e-commerce platform compliant product image sets
- Single or batch download support
