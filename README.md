# Ink Stained Wretch

A modular, type-safe author platform built with React, TypeScript, and Vite. This project features robust state management, culture selection, Stripe payments, and integrated telemetry using Microsoft Application Insights.

## Major Updates (2025)

- **Component Refactoring:**
  - All major components (AuthorForm, BookList, ChooseCulture, Checkout, ChooseSubscription, CountdownIndicator, Navbar, ImageManager, LoginRegister) now use custom hooks for logic separation (e.g., `useAuthorFormLogic`, `useCheckoutLogic`, `useLoginLogic`, etc.).
  - Components are functionally pure and maintainable.

- **Reducer Improvements:**
  - All local reducers (author, book, login, etc.) are in `src/reducers` for better organization and reuse.

- **UI/UX Enhancements:**
  - Stripe logo in Checkout is small, unobtrusive, and horizontally aligned with text.
  - Button containers use flexbox for responsive alignment.
  - Cancel buttons have a distinct style for clear user feedback.
  - All action buttons use Material UI icons and are inline with data.
  - Thumbnails and previews for images (authors, books) are consistent and responsive.

- **Type Safety:**
  - All props and state are strictly typed. Components use FC and props interfaces.

- **Domain & Culture Selection:**
  - ChooseCulture and DomainRegistration components use hooks for logic and improved UI.

- **Authentication:**
  - Login/Register uses MSAL and custom hooks for authentication and redirect countdown.

- **Testing:**
  - Tests for key reducers and components are included in the `tests` folder.

## How to Use the Latest Version

- All logic for forms, navigation, checkout, and authentication is now in hooks under `src/hooks`.
- Reducers are in `src/reducers`.
- CSS is modular and uses utility classes for layout and alignment.
- Stripe payments are visually unobtrusive and secure.
- All UI states and transitions are managed via typed reducers and hooks.

## Quick Start
```sh
npm install
npm run dev
```

## Project Structure Highlights
- `src/components/` — Modular React components
- `src/hooks/` — Custom hooks for component logic
- `src/reducers/` — Reducers for local and global state
- `src/types/` — TypeScript interfaces and types
- `src/services/` — Utility and API logic
- `src/tests/` — Unit tests

## Contributing
Pull requests are welcome! Please open an issue for major changes.

## License
MIT
