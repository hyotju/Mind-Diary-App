# AGENTS.md

# Project

마음부적은 AI 기반 감정 케어 서비스입니다.

사용자가 자신의 감정을 기록하고 AI와 대화하며 마음을 돌볼 수 있도록 돕는 모바일 중심 웹 애플리케이션입니다.

---

# Tech Stack

## Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Motion
- Zustand

## Backend

- The backend is developed and maintained by another team.
- Do not generate backend code unless explicitly requested.
- Assume communication through REST APIs.

---

# Architecture

- Use App Router only.
- Never use Pages Router.
- Prefer Server Components.
- Use Client Components only when necessary.
- Keep components reusable and composable.
- Separate UI, business logic, and state management.

---

# Folder Structure

Follow this project structure whenever possible.

```text
src/
│
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── diary/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── chat/
│   ├── notification/
│   ├── fortune/
│   └── user/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── store/
│
├── types/
│
├── utils/
│
└── constants/

public/
```

### Folder Rules

- Keep `page.tsx` as small as possible.
- Never place large UI or business logic inside `page.tsx`.
- `page.tsx` should only compose page sections.
- Move page-specific UI into `features/{feature}/components`.
- Move business logic into custom hooks or utility functions.
- API logic belongs inside `features/{feature}/api`.
- Reusable UI belongs in `components/ui`.
- Shared components belong in `components/common`.
- Layout components belong in `components/layout`.
- Shared hooks belong in `hooks`.
- Shared utilities belong in `utils`.
- Shared types belong in `types`.
- Feature-specific types remain inside each feature.

---

# Existing Code First

Before creating any new file:

1. Search the existing project.
2. Reuse existing components whenever possible.
3. Extend existing components before creating new ones.
4. Reuse existing hooks.
5. Reuse existing utilities.
6. Reuse existing Zustand stores.
7. Avoid duplicate implementations.

Never create duplicate UI or duplicate business logic.

---

# Development Workflow

For every new feature:

1. Understand the existing project structure.
2. Search for reusable code.
3. Decide whether new code is actually necessary.
4. Create the smallest amount of new code possible.
5. Keep consistency with the existing architecture.

---

# Components

- Components should have one responsibility.
- Prefer composition over large components.
- Extract reusable UI whenever possible.
- Split large components into smaller ones.
- Avoid components longer than roughly 200 lines.

---

# File Organization

When a component grows too large, split responsibilities.

Recommended order inside a component:

1. Imports
2. Types
3. Constants
4. State
5. Hooks
6. Event Handlers
7. Helper Functions
8. JSX

If a component becomes difficult to read:

- Extract reusable UI into a component.
- Extract business logic into a custom hook.
- Extract reusable helper functions into `utils`.
- Keep page files focused on composition.

---

# State Management

Choose the correct tool for the job.

## useState

Use when state is local.

Examples

- input value
- dropdown
- accordion
- local loading
- checkbox state

---

## Zustand

Use Zustand when state is shared across multiple unrelated components.

Examples

- selected emotion
- current tab
- modal state
- bottom sheet state
- notification permission
- onboarding progress
- theme
- temporary chat UI state

Rules

- Store files belong inside `src/store`.
- Split stores by feature or domain.
- Never create one giant global store.
- Zustand manages client-side state only.
- Zustand must only be used inside Client Components.
- If only one component uses the state, prefer `useState`.

---

# API Integration

- Never invent API endpoints.
- Never assume request or response formats.
- Follow the provided API specification.
- If an API is not ready, create temporary mock types with TODO comments.
- API requests belong inside each feature's `api` folder.
- Never hardcode API URLs inside components.
- Keep API logic separate from UI components.

---

# Styling

- Tailwind CSS only.
- Avoid CSS Modules unless explicitly requested.
- Prefer utility classes.
- Keep spacing, typography, and color usage consistent.

---

# Imports

Always use absolute imports.

Good

```ts
import Button from "@/components/ui/Button";
```

Bad

```ts
import Button from "../../../../components/Button";
```

---

# Animation

Use Motion.

Rules

- Keep animations subtle.
- Prioritize performance.
- Respect reduced motion preferences.
- Do not overuse animations.

---

# TypeScript

- Never use `any`.
- Always define proper types.
- Type function parameters.
- Type return values whenever possible.
- Prefer explicit typing over implicit assumptions.

---

# Naming

## Components

```text
DiaryCard.tsx
EmotionSelector.tsx
NotificationModal.tsx
```

## Variables

```ts
selectedEmotion;
diaryList;
notificationPermission;
```

## Constants

```ts
MAX_DIARY_LENGTH;
DEFAULT_THEME;
```

## Hooks

```ts
useDiary;
useNotification;
useEmotion;
```

## Stores

```ts
useEmotionStore;
useUserStore;
useThemeStore;
```

---

# Accessibility

- Icon buttons require `aria-label`.
- Inputs require labels.
- Use semantic HTML.
- Support keyboard navigation.
- Ensure sufficient color contrast.

---

# UI Principles

- Mobile-first design.
- Responsive layouts by default.
- Keep the UI clean and minimal.
- Prioritize readability over decoration.
- Use consistent spacing, typography, and colors.
- Animations should improve usability, not distract users.
- Build reusable components before page-specific implementations.

---

# Code Style

- Prefer async/await.
- Prefer early return.
- Avoid deeply nested conditions.
- Keep functions focused on one responsibility.
- Prefer readable code over clever code.
- Reuse existing implementations before creating new ones.
- Remove unused imports, variables, and dead code.

---

# Refactoring

When modifying existing code:

- Improve existing implementations instead of rewriting everything.
- Preserve the existing architecture.
- Do not introduce unnecessary abstractions.
- Create new files only when they improve maintainability.

---

# AI Instructions

Whenever generating code:

- Follow the existing folder structure.
- Follow the project's architecture.
- Keep naming consistent.
- Search for existing implementations before creating new ones.
- Reuse existing components, hooks, utilities, and stores whenever possible.
- Avoid duplicate implementations.
- Keep generated code production-ready.
- Do not create unnecessary files.
- Explain why a new file is created when introducing one.
- Prefer the simplest maintainable solution.
- Keep code clean, modular, and easy to understand.

## Error Handling

- Do not ignore TypeScript or ESLint errors.
- Do not disable lint rules unless explicitly requested.
- Fix the root cause instead of suppressing warnings.

## Figma

When implementing designs from Figma:

- Do not modify the design unless explicitly requested.
- Do not redesign icons, layouts, spacing, colors, typography, or component proportions.
- Use the icons and assets from Figma as provided.
- Match spacing, sizing, border radius, colors, and typography as closely as possible.
- If any design detail is unclear or missing, ask for clarification instead of making assumptions.
- Treat the Figma design as the source of truth.
