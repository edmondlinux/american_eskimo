# Overview

This is a **puppy breeder website** for "American Eskimo" — an ethical puppy breeding business. It's a full-stack web application where prospective families can browse available puppies, read reviews, submit inquiries, and contact the breeder. There's also an admin dashboard for managing puppies, reviews, and inquiries.

The app follows a monorepo layout with three main directories: `client/` (React frontend), `server/` (Express backend), and `shared/` (shared types, schemas, and route definitions used by both).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Monorepo Structure

- **`client/`** — React SPA (Vite-bundled)
- **`server/`** — Express API server
- **`shared/`** — Shared code (database schema, Zod validation schemas, API route definitions)
- **`migrations/`** — Drizzle-generated database migrations

## Frontend (client/)

- **Framework**: React with TypeScript
- **Bundler**: Vite (with HMR in dev, static build for production)
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming. Uses a warm "classical breeder" aesthetic with custom fonts (Fraunces serif, Manrope sans-serif)
- **Forms**: React Hook Form with Zod resolvers for validation
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Key Pages
- **Home** — Hero section with image carousel, featured puppies, reviews
- **Shop** — Browse/filter available puppies
- **Reviews** — Searchable testimonials
- **Contact** — Contact info cards
- **Inquiry** — Form to inquire about a specific puppy
- **Dashboard** — Admin panel for managing puppies, reviews, and inquiries (requires auth)
- **AuthPage** — Login/register form
- **RefundPolicy / Terms** — Static legal pages

### Data Hooks Pattern
Custom hooks in `client/src/hooks/` wrap React Query calls and validate API responses against Zod schemas from `@shared/routes`. This ensures type safety end-to-end. Examples: `use-puppies.ts`, `use-reviews.ts`, `use-inquiries.ts`, `use-auth.ts`.

## Backend (server/)

- **Framework**: Express.js with TypeScript (run via `tsx` in dev)
- **Authentication**: Passport.js with LocalStrategy (email/password), express-session for session management, bcryptjs for password hashing
- **API Design**: RESTful JSON API under `/api/` prefix. Route definitions are shared between client and server via `shared/routes.ts`
- **Storage Layer**: `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation. All database access goes through this abstraction layer.
- **Build**: esbuild bundles the server for production into `dist/index.cjs`; Vite builds client into `dist/public/`

### API Routes
- `GET /api/me` — Current user (auth check)
- `POST /api/login`, `POST /api/register`, `POST /api/logout` — Auth endpoints
- `GET /api/puppies` — List puppies (optional `availableOnly` filter)
- `GET /api/puppies/:id` — Get single puppy
- `POST /api/puppies` — Create puppy (admin)
- `PATCH /api/puppies/:id` — Update puppy (admin)
- `DELETE /api/puppies/:id` — Delete puppy (admin)
- `GET /api/inquiries` — List inquiries (admin)
- `POST /api/inquiries` — Submit inquiry (public)
- `GET /api/reviews` — List reviews
- `POST /api/reviews` — Create review (admin)
- `PATCH /api/reviews/:id` — Update review (admin)
- `DELETE /api/reviews/:id` — Delete review (admin)

## Database

- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for automatic Zod schema generation from table definitions
- **Schema Push**: `npm run db:push` uses drizzle-kit to push schema to database
- **Tables**: `users`, `puppies`, `inquiries`, `reviews` — all defined in `shared/schema.ts` with UUID primary keys (`gen_random_uuid()`)

## Shared Layer (shared/)

- **`schema.ts`** — Drizzle table definitions, insert schemas (via `drizzle-zod`), and TypeScript types. This is the single source of truth for data shapes.
- **`routes.ts`** — API route manifest with paths, methods, Zod input/output schemas. Used by both client hooks and server route handlers. Includes a `buildUrl()` helper for parameterized paths.

## Dev vs Production

- **Development**: Vite dev server runs as middleware on the Express server with HMR. Uses `tsx` to run TypeScript directly.
- **Production**: Client is built with Vite to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`. Express serves static files from the built client directory with SPA fallback.

# External Dependencies

- **PostgreSQL** — Primary database. Must be provisioned and `DATABASE_URL` env var set.
- **Google Fonts** — Fraunces, Manrope, DM Sans, Geist Mono, Fira Code, Architects Daughter loaded via CDN
- **No other external services** — No payment processing, email services, or third-party APIs are currently integrated (Stripe, nodemailer, OpenAI etc. are in the build allowlist but not actively used in the codebase)

### Key npm packages
- `drizzle-orm` + `drizzle-kit` + `drizzle-zod` — Database ORM and schema management
- `express` + `express-session` — HTTP server and sessions
- `passport` + `passport-local` — Authentication
- `bcryptjs` — Password hashing
- `zod` — Runtime validation (shared between client and server)
- `@tanstack/react-query` — Client-side data fetching/caching
- `wouter` — Client-side routing
- `react-hook-form` + `@hookform/resolvers` — Form handling
- shadcn/ui ecosystem (`@radix-ui/*`, `class-variance-authority`, `tailwind-merge`, `clsx`)
- `embla-carousel-react` — Carousel component
- `recharts` — Chart component (available but may not be actively used)
- `lucide-react` — Icon library