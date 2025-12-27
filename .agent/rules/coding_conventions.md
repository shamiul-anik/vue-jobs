# Coding Conventions

## Vue.js
- **Composition API**: Use <script setup> syntax.
- **Reactivity**: Prefer ef for primitives, eactive for objects.
- **Props**: Use defineProps.
- **Emits**: Use defineEmits.
- **No Pinia**: Use composables (useAuth.js) for global state management.

## CSS (Tailwind)
- Use utility classes primarily.
- Custom styles in src/assets/styles.css using @apply or standard CSS.
- Responsive design: Mobile-first approach.

## Backend (Express)
- **Architecture**: Controller-Service-Repository pattern (lightweight).
- **Routes**: Defined in outes/.
- **Validation**: Use express-validator middleware.
- **Error Handling**: Centralized error handling.

## Code Style
- **Formatting**: Prettier (implied).
- **Naming**: PascalCase for components, camelCase for variables/functions.
