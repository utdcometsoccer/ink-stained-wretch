# Application Insights Setup

This application uses Microsoft Application Insights for telemetry, error tracking, and analytics.

## Configuration

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your Application Insights connection string:

```bash
VITE_APPLICATION_INSIGHTS_CONNECTION_STRING=InstrumentationKey=your-key;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/;LiveEndpoint=https://your-region.livediagnostics.monitor.azure.com/
```

## Getting Your Connection String

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to your Application Insights resource
3. In the overview page, copy the **Connection String** (not the Instrumentation Key)
4. Paste it into your `.env` file

## What Gets Tracked

- **Page Views**: Automatic tracking of route changes
- **Errors**: All unhandled errors and exceptions
- **Custom Events**: UI state changes and user interactions
- **Performance**: Ajax calls and page load times
- **User Sessions**: Anonymous user behavior tracking

## Environment Variables

The app will work without Application Insights configured, but you'll see a warning in the console. In production, make sure to set the environment variable in your hosting platform.

## Privacy

Application Insights is configured to track anonymous usage data only. No personally identifiable information is collected.
