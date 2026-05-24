# Mobile Patterns

Supplementary patterns for this codebase. See CLAUDE.md for full architecture docs.

## File Layout Convention

```text
app/          # Expo Router screens (file-based routing)
components/   # Reusable UI components
  ui/         # Primitive components (button, input, select, switch, textarea, text, icon)
store/        # Legend State observable stores + types
services/     # API service functions (login, sync, farmFavorite)
lib/          # Utilities (storage abstraction, cn() helper)
jest-mocks/   # Custom mocks for RN and Expo modules
```

## Conventions

- Observable names are suffixed with `$` (e.g., `token$`, `farmsData$`)
- Server mutations use TanStack Query (`useMutation`) for loading/error state; reads come from the observable store (not React Query)
- Test files live alongside their source files (e.g., `store/data.test.ts`)
- API URL is read from `utils/config.ts` which pulls from `expo-constants` → `app.config.ts` extra
- All three environments currently point to `https://moulinette.fly.dev/api/`
