# Ink Stained Wretch

A modular, type-safe author platform built with React, TypeScript, and Vite. This project features robust state management, culture selection, and integrated telemetry using Microsoft Application Insights.

## Key Features
- **Modular Component Architecture**: Components like `ChooseCulture` are organized in their own folders with colocated CSS and props interfaces for maintainability.
- **Type-Safe State Management**: Uses `useReducer` and strict TypeScript types for UI state, culture, language, and region selection.
- **Culture Selection**: Supports ISO 639-1 language codes and ISO 3166-1 region codes, with user-friendly dropdowns and auto-detection logic.
- **Application Insights Integration**: Tracks page views, errors, custom events, performance, and user sessions anonymously.
- **Vite + React 18**: Fast development environment with HMR and modern tooling.

## Recent Changes
- Migrated `ChooseCulture` to its own folder with `index.tsx` entry point and colocated CSS.
- Split out `ChooseCultureProps` to a separate file for better type management.
- Modularized language and region code mappings into `languageNames.ts` and `regionNames.ts`.
- Updated reducer and UI logic to support auto-detecting culture from browser settings.
- Integrated Microsoft Application Insights for telemetry and analytics.
- Initial commit and push to GitHub remote repository.

## Application Insights Setup

This application uses Microsoft Application Insights for telemetry, error tracking, and analytics.

### Configuration

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your Application Insights connection string:

```bash
VITE_APPLICATION_INSIGHTS_CONNECTION_STRING=InstrumentationKey=your-key;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/;LiveEndpoint=https://your-region.livediagnostics.monitor.azure.com/
```

### Getting Your Connection String

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your Application Insights resource
3. In the overview page, copy the **Connection String** (not the Instrumentation Key)
4. Paste it into your `.env` file

### What Gets Tracked
- **Page Views**: Automatic tracking of route changes
- **Errors**: All unhandled errors and exceptions
- **Custom Events**: UI state changes and user interactions
- **Performance**: Ajax calls and page load times
- **User Sessions**: Anonymous user behavior tracking

### Environment Variables
The app will work without Application Insights configured, but you'll see a warning in the console. In production, make sure to set the environment variable in your hosting platform.
## Folder Structure

```
ink-stained-wretch/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── AuthorPage.tsx
│   │   ├── AuthorPageProps.tsx
│   │   ├── Checkout.tsx
│   │   ├── CheckoutProps.tsx
│   │   ├── ChooseCulture/
│   │   │   ├── autoDetectCulture.ts
│   │   │   ├── AutoDetectLoading.tsx
│   │   │   ├── ChooseCulture.css
│   │   │   ├── ChooseCultureForm.tsx
│   │   │   ├── ChooseCultureFormProps.tsx
│   │   │   ├── ChooseCultureProps.ts
│   │   │   ├── handleCultureSubmit.ts
│   │   │   ├── handleLanguageSelect.ts
│   │   │   ├── handleRegionSelect.ts
│   │   │   ├── index.tsx
│   │   │   ├── languageNames.ts
│   │   │   └── regionNames.ts
│   │   ├── ChooseSubscription.tsx
│   │   ├── CountdownIndicator/
│   │   │   ├── CountdownIndicatorProps.tsx
│   │   │   └── index.tsx
│   │   ├── DomainRegistration/
│   │   │   ├── ContactInfoForm.tsx
│   │   │   ├── ContactInfoFormProps.tsx
│   │   │   ├── DomainInput.tsx
│   │   │   ├── DomainRegistration.css
│   │   │   ├── domainRegistrationLogic.ts
│   │   │   ├── DomainRegistrationProps.tsx
│   │   │   └── index.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorPage.css
│   │   ├── ErrorPage.tsx
│   │   ├── ErrorPageProps.tsx
│   │   ├── LoginRegister/
│   │   │   ├── index.tsx
│   │   │   ├── LoginButton.tsx
│   │   │   ├── LoginButtonProps.tsx
│   │   │   ├── LoginHeader.tsx
│   │   │   ├── loginLogic.ts
│   │   │   ├── LoginRegister.css
│   │   │   ├── LogoutButton.tsx
│   │   │   └── LogoutHeader.tsx
│   │   ├── Navbar/
│   │   │   ├── index.tsx
│   │   │   ├── Navbar.css
│   │   │   ├── NavbarProps.tsx
│   │   │   ├── NavItem.tsx
│   │   │   └── navItems.tsx
│   │   ├── ThankYou.tsx
│   │   ├── ThankYouProps.tsx
│   ├── constants/
│   │   ├── regionNames.ts
│   │   └── stateProvinceNames.ts
│   ├── reducers/
│   │   └── appReducer.ts
│   ├── services/
│   │   ├── applicationInsights.ts
│   │   ├── domainRegex.ts
│   │   ├── domainValidate.ts
│   │   ├── extractSelectedRegion.ts
│   │   ├── getLanguageFromCulture.ts
│   │   ├── getRegionFromCulture.ts
│   │   ├── getStateProvinceOptions.ts
│   │   ├── isValidCulture.ts
│   │   ├── isValidLanguage.ts
│   │   ├── isValidRegion.ts
│   │   ├── msalConfig.ts
│   │   ├── validateDomainWhois.ts
│   │   ├── validateEmail.ts
│   │   └── validatePhone.ts
│   ├── types/
│   │   ├── Article.ts
│   │   ├── Author.ts
│   │   ├── Book.ts
│   │   ├── ContactInformation.ts
│   │   ├── Culture.ts
│   │   ├── Domain.ts
│   │   ├── DomainRegistration.ts
│   │   ├── Language.ts
│   │   ├── LoginAction.ts
│   │   ├── LoginLogicResult.ts
│   │   ├── Region.ts
│   │   ├── Social.ts
│   │   ├── SocialLink.ts
│   │   ├── State.ts
│   │   ├── UIStates.ts
│   │   ├── UserProfile.ts
│   │   └── WhoisResult.ts
│   └── tests/
│       └── isValidCulture.test.ts
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── setupTests.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── .gitignore
```
