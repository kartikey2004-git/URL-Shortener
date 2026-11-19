# Design system

Tokens live in `src/styles/tokens.css` (CSS variables) and are exposed as
Tailwind utilities in `tailwind.config.js`. **Never hardcode colors, shadows,
z-indexes or durations in components**; use the utilities below.

## Tokens

### Color (HSL channels; light / dark)

| Token | Utility | Purpose |
| --- | --- | --- |
| `--background` / `--foreground` | `bg-background text-foreground` | Page |
| `--card`, `--popover` (+ `-foreground`) | `bg-card`, `bg-popover` | Surfaces |
| `--primary` (+ `-foreground`) | `bg-primary` | Brand, primary actions |
| `--secondary`, `--accent` | `bg-secondary`, `bg-accent` | Secondary/hover fills |
| `--muted` / `--muted-foreground` | `bg-muted text-muted-foreground` | Subdued fills and text |
| `--destructive` | `bg-destructive text-destructive` | Errors, delete |
| `--success`, `--warning` | `bg-success`, `bg-warning` | Status (Badge, Alert) |
| `--border`, `--input`, `--ring` | `border-border`, `ring-ring` | Lines and focus |

Opacity modifiers work (`bg-primary/90`). Dark mode = `.dark` class on `<html>`.

### Other tokens

| Group | Tokens |
| --- | --- |
| Typography | Inter (`font-sans`); sizes are Tailwind's scale plus `text-2xs` (10px); roles `.heading-page`, `.heading-section`, `.eyebrow` |
| Spacing | Tailwind default 4px scale |
| Radius | `--radius` 0.5rem → `rounded-sm/md/lg/xl` (−4 / −2 / 0 / +4px). Controls use `md`; cards and dialogs use `xl` |
| Shadow | `shadow-sm/md/lg` → `--shadow-*` |
| Border width | Tailwind defaults (`border` = 1px) |
| Z-index | `z-header` 40, `z-modal` 50, `z-popover` 60, `z-progress` 100 |
| Motion | `duration-fast` 150ms, `duration-base` 200ms, `duration-slow` 300ms |
| Breakpoints | `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536` (mobile-first) |

## Components

**Primitives** (`components/ui`): Button (variants `default destructive outline secondary ghost link`; sizes `default sm lg icon icon-sm`; `loading` prop), Input, Label, Card (+ Header/Title/Description/Content/Footer), Badge (adds `success`/`warning`), Alert (`default destructive success warning`), Tabs, Dialog (+ Header/Body/Footer), DropdownMenu, Accordion, Avatar, Spinner, ProgressBar.

**Shared** (`components/shared`): TextField (label + icon input + error), IconInput, FieldError, EmptyState, PageHeader, PageProgress.

**Layout** (`components/layout`): AppLayout (owns the `max-w-6xl` container and horizontal padding; pages must not add their own), Header, Footer.

### Shared states
* **Focus**: every interactive control shows `ring-2 ring-ring ring-offset-2` on `:focus-visible`.
* **Disabled**: `opacity-50` + no pointer events. **Invalid**: Input gets a destructive border via `aria-invalid`.
* **Loading**: `Button loading`, `PageProgress` for page/route work.

## CSS conventions
* Utilities in JSX; component CSS only in `styles/base.css` under `@layer components` for roles reused across screens.
* No `!important`, no arbitrary values for things that have a token (`text-[10px]`, `z-[100]`).
* Variants via `class-variance-authority` in `*-variants.js` next to the component.
* A custom class such as `.eyebrow` is not understood by `tailwind-merge`; do not combine it with conflicting Tailwind text utilities on the same element.
