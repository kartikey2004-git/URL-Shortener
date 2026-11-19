# Architecture

Vite + React 18 (JavaScript) SPA. Supabase provides auth, Postgres and storage;
there is no custom backend. Styling is Tailwind driven by CSS-variable tokens.

## Folder structure

```
src/
  main.jsx                 Entry: global CSS + <App/>
  app/                     App shell: providers (App.jsx) and routes (router.jsx)
  pages/                   Page-level compositions, one per route (default exports)
  features/
    auth/                  Supabase auth API, AuthProvider/useAuth, RequireAuth, Login/SignUp forms, schemas
    links/                 Links API, CreateLinkDialog, LinkCard, StatCard, link helpers, schemas
    analytics/             Click API (read + record), LocationStats chart
    theme/                 ThemeProvider/useTheme, ModeToggle
  components/
    ui/                    Design-system primitives (Radix/shadcn wrappers + variants)
    shared/                App-wide composites built from primitives (TextField, EmptyState, ...)
    layout/                AppLayout, Header, Footer
  hooks/                   Cross-feature hooks (use-fetch)
  lib/                     Framework-free helpers: supabase client, constants, routes, validation, api-error
  styles/                  tokens.css, base.css, index.css
docs/                      This file and design-system.md
```

## Layers and dependency rules

Dependencies point downward only:

`pages → features → components/shared → components/ui → lib`

* `components/ui` knows nothing about the app (no features, no Supabase).
* `components/shared` and `components/layout` may use `ui`, `lib`, and feature
  *hooks/context* where unavoidable (Header reads auth + theme).
* A feature may import `lib`, `hooks`, `components/*`, and another feature's
  **context/hook or API** (e.g. links read `useAuth`). Features never import
  from `pages`.
* Files that export hooks/contexts (`auth-context.js`, `theme-context.js`) are
  separate from the provider components so React Fast Refresh keeps working.

## Data flow

* **API modules** (`features/*/api.js`) are the only code that talks to Supabase.
  They throw `Error`s with user-safe messages via `lib/api-error.js`.
* **`useFetch(asyncFn)`** wraps an API function with `data/loading/error`.
  `run(...args)` never throws; it resolves `{ data, error }`, so callers do
  `const { error } = await run(...)` instead of effects watching state.
* **Auth** is a single context (`useAuth`): `user`, `isAuthenticated`, `loading`
  (true until the persisted session was read once), `refreshUser()`.
* **Routing**: `lib/routes.js` holds paths and the `createNew` query param that
  carries a pasted URL through login into the create dialog. `/link/:id` is
  code-split so the charting library loads only when needed.

## Decisions

| Decision | Reason |
| --- | --- |
| Stay on JavaScript, use PropTypes for app components | A TS migration is a rewrite with no tests to protect it. PropTypes give runtime contracts now; TS can follow incrementally. |
| `react/prop-types` lint rule is off **only** in `components/ui/` | Those wrappers forward every prop to Radix/DOM elements. App components must declare PropTypes. |
| Feature folders, not per-type folders | Keeps links/auth/analytics code together; only three small features, so no extra layers. |
| `useFetch.run` returns `{ data, error }` | Removes "watch `data` in an effect to navigate" patterns and stale-closure bugs. |
| Replaced `react-spinners` with `Spinner` / `ProgressBar` | Used hardcoded black colors (invisible in dark mode); now token-driven, one fewer dependency. |
| Removed Device chart | `Device-stats.jsx` was never rendered. Device data is still recorded; restore from git history if wanted. |
