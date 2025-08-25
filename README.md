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

### Privacy
Application Insights is configured to track anonymous usage data only. No personally identifiable information is collected.

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/utdcometsoccer/ink-stained-wretch.git
   cd ink-stained-wretch
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (see Application Insights Setup above).
4. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/components/ChooseCulture/` — Culture selection UI, props, CSS, and code mappings
- `src/types/` — TypeScript type definitions for app state, culture, language, region, etc.
- `src/services/applicationInsights.ts` — Application Insights integration
- `docs/APPLICATION_INSIGHTS.md` — Telemetry setup and documentation

## License
MIT
