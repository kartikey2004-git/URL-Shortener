
# URL Shortener — Track & Manage Your Links

A minimal, fast, and fully functional URL shortener built using **React**, **Supabase**, and **Vite**.  
Shorten long URLs, get analytics, and manage your links through a clean dashboard — all in one place.

---

## Preview

**Live Site** → [https://clipppyurl.vercel.app/](https://clipppyurl.vercel.app/)  
**Repo** → [https://github.com/kartikey2004-git/URL-Shortener](https://github.com/kartikey2004-git/URL-Shortener)

---

## Tech Stack

| Layer       | Tools Used                               |
|-------------|----------------------------------        |
| Frontend    | React.js, Vite, JavaScript, Tailwind CSS |
| Backend     | Supabase (PostgreSQL, Auth, Realtime)    |
| Utilities   |                                          |

---

## Key Features

- **Instant URL Shortening**  
  Cleanly shorten long and messy URLs to compact links.

- **Analytics Dashboard**  
  Track clicks, device types, timestamps, and more for each shortened URL.

- **User Auth with Supabase**  
  Only authenticated users can create, view, and manage their links.

- **Link Management System**  
  Edit or delete your links from a personalized dashboard.

- **Responsive Design**  
  Fully functional across mobile, tablet, and desktop.



## Project Overview

The project follows a frontend-first architecture with Supabase acting as the backend for authentication, real-time database handling, and analytics.

**Supabase Handles:**
- Row-level security for users
- Realtime tracking for click counts
- User session management

**Frontend Handles:**
- Link input + validation
- Client-side routing (React Router)
- Auth state and protected pages
- Responsive UI and animations

---

## Getting Started Locally

### Clone the repo:
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### Install dependencies
```bash
npm install
```

### Add your Supabase keys

```bash
.env

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-anon-key
```

### Run locally
```bash
npm run dev
```


## Folder Structure

See [docs/architecture.md](docs/architecture.md) for layers and dependency rules, and
[docs/design-system.md](docs/design-system.md) for tokens and components.

```
src/
  app/          providers + router
  pages/        one page per route
  features/     auth, links, analytics, theme
  components/   ui (primitives), shared, layout
  hooks/  lib/  styles/
```

---

## License: This project is open-source. Feel free to explore, use, and contribute!


## Testing

`npm test` runs the Vitest suite (unit tests, plus migration/API tests against an in-process Postgres via PGlite).

## Database migration (required before deploying)

Apply `supabase/migrations/20261119000000_urls_slug_integrity.sql` to the Supabase project
(run the pre-flight duplicate queries at the top of the file first). It adds UNIQUE constraints on
`urls.short_url` / `urls.custom_url` and a `NOT VALID` format check for new custom slugs.
Short codes are 4 chars of `[a-z0-9]` (~1.68M codes); to lengthen them, change `SHORT_CODE_LENGTH`
in `src/lib/constants.js` - existing codes keep resolving, no data migration needed.

## QR download requirement

QR images are downloaded by `fetch`ing them from Supabase Storage, so the `qrs` bucket must be
public and answer with CORS headers (`Access-Control-Allow-Origin`) for the app's origin.
