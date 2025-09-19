# Ink Stained Wretch

A modular, type-safe author platform built with React, TypeScript, and Vite. It supports subscription checkout with Stripe, multi-language localization, responsive design, and telemetry via Microsoft Application Insights.

## Demo Video

[![Watch the demo](./docs/InkStainedWretchesScreenshot.png)](https://youtu.be/RgZER2OMr1U)

## Key Features

- React + TypeScript + Vite with strict typing and modular architecture
- Robust state management with typed reducers (`src/reducers`) and hooks (`src/hooks`)
- Localization via context and JSON locale files (`src/locales/*.json`)
- Stripe subscription checkout with an embedded flow and/or redirect flow
- Responsive UI (reusable `Container` and mobile/desktop breakpoints)
- Author and Book management with image uploads and external imports
- Microsoft Entra (MSAL) sign-in flow
- Application Insights telemetry and component tracking
- Extensive unit tests (Vitest, Testing Library)

## Recent Updates (2025)

- Subscribe and Checkout pages localized; new locale keys added across all supported languages
- Book descriptions truncate using an environment-configurable limit with ellipsis
- Responsive `Container` component and layout polish across pages
- Stripe checkout UI improvements; clear loading state with styled circular progress
- Environment-driven subscription plan pagination (max pages)
- Error boundaries and improved user-friendly error pages

## Tech Stack

- UI: React 19, TypeScript, Vite 7, MUI
- Auth: MSAL for Microsoft Entra ID
- Payments: Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Telemetry: Microsoft Application Insights
- Test: Vitest + Testing Library + jsdom

## Project Structure

- `src/components/` — Feature components (Checkout, ChooseSubscription, BookList, ImageManager, LoginRegister, Navbar, etc.)
- `src/hooks/` — Custom hooks (data fetching, subscription logic, localization helpers, tracking)
- `src/reducers/` — Reducers for app slices
- `src/services/` — API clients, formatting, telemetry
- `src/types/` — Shared types and interfaces
- `src/locales/` — Locale JSON files (e.g., `inkstainedwretch.en-us.json`, `*.fr-ca.json`, `*.es-mx.json`, `*.ar-eg.json`, `*.zh-tw.json`)
- `tests/` — Unit tests for reducers, hooks, and components

## Getting Started

### Prerequisites

- Node.js LTS (18+) and npm
- A Stripe account and publishable key
- Optional: Azure account for hosting the backend (Functions) and Application Insights

### Install and Run (Windows PowerShell)

```powershell
npm install
npm run dev
```

Open http://localhost:5173 (default Vite port) unless overridden.

## Environment Variables

Create a `.env` in the project root (already included in this repo for local development). Do NOT commit secrets in production.

Frontend (Vite) variables (prefix VITE_):

- API endpoints
  - `VITE_OPENLIBRARY_AUTHOR_SEARCH_URL`
  - `VITE_GOOGLE_BOOKS_API_URL`
  - `VITE_IMAGE_API_URL`
  - `VITE_USER_DOMAIN_REGISTRATIONS_API_URL`
  - `VITE_LOCALIZATION_API_URL`
  - `VITE_SUBSCRIPTION_PLANS_API_URL`
  - `VITE_WHOIS_API_URL`
  - Penguin Random House integration:
    - `VITE_PENGUIN_RANDOM_HOUSE_API_URL`
    - `VITE_PENGUIN_RANDOM_HOUSE_API_KEY`
    - `VITE_PENGUIN_RANDOM_HOUSE_API_DOMAIN`
    - `VITE_PENGUIN_RANDOM_HOUSE_SEARCH_API`
    - `VITE_PENGUIN_RANDOM_HOUSE_LIST_TITLES_BY_AUTHOR_API`
    - `VITE_PENGUIN_RANDOM_HOUSE_URL`

- Stripe
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `VITE_STRIPE_CHECKOUT_SESSION_URL` (Azure Function or backend endpoint)
  - `VITE_STRIPE_CREATE_CUSTOMER_URL`
  - `VITE_STRIPE_CREATE_SUBSCRIPTION_URL`
  - `VITE_STRIPE_LOGO_URL`
  - `VITE_ENABLE_STRIPE_CHECKOUT` (feature flag)

- Microsoft Entra (MSAL)
  - `VITE_ENTRA_CLIENT_ID`
  - `VITE_ENTRA_TENANT_ID`
  - `VITE_ENTRA_POLICY`
  - `VITE_ENTRA_AUTHORITY`
  - `VITE_ENTRA_SCOPES`

- App Insights
  - `VITE_APPLICATION_INSIGHTS_CONNECTION_STRING`

- App Settings and Feature Flags
  - `VITE_APP_NAME`
  - `VITE_CONTACT_EMAIL`
  - `VITE_COUNTDOWN_SECONDS` (Login redirect countdown)
  - `VITE_BOOK_DESCRIPTION_LIMIT` (default 140)
  - `VITE_SUBSCRIPTION_PLANS_MAX_PAGES` (subscription plan pagination; default 20)

Type declarations live in `src/vite-env.d.ts`. If you add a new `VITE_` variable, also add it to that file to keep type safety.

## Localization

- Locale files live in `src/locales/inkstainedwretch.<locale>.json`
- The localization context (`src/LocalizationContext.tsx`) exposes a typed shape consumed via a custom hook (e.g., `useLocalizationContext`) from components
- To add/translate a key:
  1. Add the key to the type in `src/types/LocalizedText.ts`
  2. Update all locale JSON files with the translated value
  3. Use the key via the localization context in your component

## Supported Locales

This app includes UI strings for the following locales out of the box:

- US English (`en-us`)
- Mexican Spanish (`es-mx`)
- Canadian French (`fr-ca`)
- Egyptian Arabic (`ar-eg`)
- Taiwanese Traditional Chinese (`zh-tw`)

Additional locales can be added by:

1. Creating a new JSON file under `src/locales/` following the existing structure
2. Ensuring all required keys exist (see `src/types/LocalizedText.ts`)
3. Optionally providing translations via an external API (`VITE_LOCALIZATION_API_URL`) for server-driven or dynamic localization

## Stripe Checkout

- The app supports selecting a subscription plan and completing payment with Stripe
- Loading/redirect states show a styled circular progress for clear feedback
- See `STRIPE_CHECKOUT_AZURE.md` for a complete Azure Functions + React walkthrough

Related docs:

- [Stripe Checkout + Azure Functions](./STRIPE_CHECKOUT_AZURE.md)
- [Subscription Plan API](./SubscriptionPlanAPI.md)
- [Image API](./API_IMAGE.md)
- [Author API](./AuthorAPI.md)
- [Domain Registration API](./DomainRegistrationAPI.md)

## Scripts

Defined in `package.json`:

- `npm run dev` — Start Vite dev server (with `--host` for LAN access)
- `npm run build` — Type-check and build for production (`tsc -b && vite build`)
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint
- `npm run test` — Run unit tests (Vitest)

## Testing

Run the unit tests:

```powershell
npm run test
```

Tests live under `tests/` and cover reducers, hooks, and core components.

## Try It Locally

Run the app locally with mock endpoints and sample environment values.

1) Create a `.env` file in the project root with sample values:

```properties
# App basics
VITE_APP_NAME=InkStainedWretches.com
VITE_CONTACT_EMAIL=dev@example.com
VITE_COUNTDOWN_SECONDS=10
VITE_BOOK_DESCRIPTION_LIMIT=140
VITE_SUBSCRIPTION_PLANS_MAX_PAGES=20

# Mock/local API endpoints
VITE_SUBSCRIPTION_PLANS_API_URL=http://localhost:7071/api/GetStripePriceInformation
VITE_LOCALIZATION_API_URL=http://localhost:7072/api/localizedtext/
VITE_IMAGE_API_URL=/api/images
VITE_OPENLIBRARY_AUTHOR_SEARCH_URL=https://openlibrary.org/search/authors.json?q=
VITE_GOOGLE_BOOKS_API_URL=https://www.googleapis.com/books/v1/volumes

# Stripe (test mode only for local)
VITE_ENABLE_STRIPE_CHECKOUT=false
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_12345
VITE_STRIPE_CHECKOUT_SESSION_URL=http://localhost:7071/api/CreateStripeCheckoutSession
VITE_STRIPE_CREATE_CUSTOMER_URL=http://localhost:7071/api/CreateStripeCustomer
VITE_STRIPE_CREATE_SUBSCRIPTION_URL=http://localhost:7071/api/CreateSubscription
VITE_STRIPE_LOGO_URL=https://stripe.com/img/v3/home/social.png

# Optional telemetry
VITE_APPLICATION_INSIGHTS_CONNECTION_STRING=
```

2) Use a mock backend

- Spin up any simple local server (Functions, Express, etc.) that returns minimal JSON payloads for the endpoints above, or guard calls in services with a feature flag.
- Keep `VITE_ENABLE_STRIPE_CHECKOUT=false` for local runs without real payments.

3) Start the app

```powershell
npm install
npm run dev
```

Open http://localhost:5173.

## Troubleshooting

- Blank page or 404: Ensure Vite dev server is running and URLs are correct
- Env vars not picked up: Restart dev server after editing `.env` and ensure variables start with `VITE_`
- Type errors for env vars: Add the variable name to `src/vite-env.d.ts`
- Stripe errors: Verify publishable key and backend endpoints; check CORS on the Function
- Localization key missing: Add to `src/types/LocalizedText.ts` and all `src/locales/*.json`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repo and create your feature branch
  - Naming: `feature/<short-name>` or `fix/<short-name>`
2. Install dependencies and run locally (see Quick Start)
3. Add or update tests for your changes
4. Lint and type-check before pushing
5. Open a Pull Request describing the change and linking any related issues

PR Checklist:

- [ ] Unit tests passing (`npm run test`)
- [ ] Lint/type-check pass (`npm run lint`, `npm run build`)
- [ ] Docs updated (README or inline comments) if needed
- [ ] No secrets committed; env variables documented

Coding style:

- TypeScript strict; prefer explicit types for public APIs
- Keep components small; put logic in hooks where reasonable
- Avoid breaking changes without discussion

## License

MIT
