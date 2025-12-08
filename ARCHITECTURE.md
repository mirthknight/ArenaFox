# ArenaFox Architecture & Modular Structure

## Current State Analysis

### ✅ **What's Working Well:**
- **UI Library Stack**: Mantine UI + Tailwind CSS + Framer Motion (modern, consistent)
- **Design System**: Custom colors (neon, accent, midnight), glassmorphism, gradient text
- **TypeScript**: Properly configured with strict mode
- **Build Setup**: Vite with React plugin, optimized dev server

### ⚠️ **Issues Identified:**
1. **Monolithic App.tsx**: All logic (splash, login form, animations) in one 240-line file
2. **No Component Separation**: SplashScreen, ThemeIconFrame, LoginForm all inline
3. **No Feature Modules**: Auth logic, routing, state management not separated
4. **No Reusable Components**: Custom UI components not extracted
5. **No Constants/Config**: Magic numbers and strings scattered
6. **No Type Definitions**: Missing TypeScript interfaces for props/state

## Proposed Modular Structure

```
src/
├── app/                    # App-level setup
│   ├── App.tsx            # Main app router/container
│   └── providers/         # Context providers
│       └── MantineProvider.tsx
│
├── features/              # Feature-based modules
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── SplashScreen.tsx
│       │   └── ThemeIconFrame.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── types/
│       │   └── auth.types.ts
│       └── utils/
│           └── auth.utils.ts
│
├── shared/                # Shared/reusable code
│   ├── components/        # Reusable UI components
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   └── layout/
│   │       ├── Container.tsx
│   │       └── Stack.tsx
│   ├── hooks/            # Shared hooks
│   │   └── useSplashScreen.ts
│   ├── constants/        # App-wide constants
│   │   ├── theme.ts
│   │   └── config.ts
│   └── types/            # Shared TypeScript types
│       └── common.types.ts
│
├── styles/               # Global styles
│   ├── index.css
│   └── components.css    # Component-specific styles
│
└── main.tsx              # Entry point
```

## Component Breakdown

### 1. **Feature: Auth** (`src/features/auth/`)
- **LoginForm.tsx**: Form component with email/password inputs
- **SplashScreen.tsx**: Loading screen with progress animation
- **ThemeIconFrame.tsx**: Animated icon wrapper
- **useAuth.ts**: Authentication logic hook
- **auth.types.ts**: Login credentials, auth state interfaces

### 2. **Shared Components** (`src/shared/components/`)
- **ui/Button.tsx**: Consistent button styling wrapper
- **ui/Card.tsx**: Glass panel card component
- **ui/Input.tsx**: Styled input wrapper
- **layout/Container.tsx**: Page container wrapper

### 3. **Constants** (`src/shared/constants/`)
- **theme.ts**: Color palette, spacing, shadows
- **config.ts**: App config (API URLs, feature flags)

## UI Component Library Analysis

### **Mantine UI** (Primary Component Library)
- ✅ **Card**: Glass panel styling
- ✅ **Button**: Primary/outline variants
- ✅ **TextInput**: Email/password inputs
- ✅ **Switch**: Remember me toggle
- ✅ **Badge**: Status indicators
- ✅ **Stack/Group**: Layout utilities
- ✅ **Container**: Responsive container
- ✅ **Notifications**: Toast notifications

### **Framer Motion** (Animations)
- ✅ **motion.div**: Splash screen animations
- ✅ **animate prop**: Icon rotations, progress animations

### **Lucide React** (Icons)
- ✅ **ShieldCheck, LogIn, AlertCircle, Sparkles**: Consistent icon set

### **Tailwind CSS** (Styling)
- ✅ **Custom classes**: `.glass-panel`, `.gradient-text`, `.button-primary`
- ✅ **Color system**: `neon`, `accent`, `midnight`
- ✅ **Responsive**: Mobile-first breakpoints

## Development Guidelines for Consistency

### 1. **Component Structure**
```tsx
// Standard component template
import React from 'react';
import { ComponentProps } from './Component.types';

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
};
```

### 2. **Styling Approach**
- **Mantine components** for complex UI (forms, modals, notifications)
- **Tailwind utilities** for layout, spacing, colors
- **Custom CSS classes** for reusable patterns (`.glass-panel`, `.gradient-text`)
- **Framer Motion** for interactive animations

### 3. **Type Safety**
- Define interfaces in `*.types.ts` files
- Export types from feature modules
- Use strict TypeScript configuration

### 4. **File Naming**
- Components: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Types: `camelCase.types.ts` (e.g., `auth.types.ts`)
- Utils: `camelCase.utils.ts` (e.g., `auth.utils.ts`)

### 5. **Import Organization**
```tsx
// 1. React imports
import React from 'react';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { Button } from '@mantine/core';

// 3. Shared components/hooks
import { Card } from '@/shared/components/ui/Card';

// 4. Feature-specific imports
import { useAuth } from '@/features/auth/hooks/useAuth';

// 5. Types
import type { LoginFormProps } from './LoginForm.types';

// 6. Styles (if component-specific)
import './LoginForm.css';
```

## Next Steps

1. ✅ **Create modular structure** - Break down App.tsx into feature modules
2. ✅ **Extract components** - SplashScreen, LoginForm, ThemeIconFrame
3. ✅ **Add TypeScript types** - Define interfaces for all components
4. ✅ **Create shared components** - Reusable UI components library
5. ✅ **Set up path aliases** - Configure `@/` imports in tsconfig.json
6. ✅ **Document component API** - Add JSDoc comments for components

## Benefits of Modular Structure

- **Maintainability**: Easy to find and update code
- **Reusability**: Components can be shared across features
- **Testability**: Isolated components are easier to test
- **Scalability**: New features can be added without touching existing code
- **Team Collaboration**: Multiple developers can work on different features
- **Type Safety**: Better TypeScript inference and error catching

