import { ApplicationInsights } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

export const initializeAppInsights = () => {
  const connectionString = import.meta.env.VITE_APPLICATION_INSIGHTS_CONNECTION_STRING;
  
  if (!connectionString) {
    console.warn('Application Insights connection string not found. Analytics will not be available.');
    return null;
  }

  if (appInsights) {
    return appInsights; // Already initialized
  }

  try {
    appInsights = new ApplicationInsights({
      config: {
        connectionString: connectionString,
        enableAutoRouteTracking: true, // Track route changes automatically
        enableCorsCorrelation: true, // Enable CORS correlation
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableAjaxErrorStatusText: true,
        enableAjaxPerfTracking: true,
        maxAjaxCallsPerView: 20,
        disableExceptionTracking: false,
        disableTelemetry: false,
        enableUnhandledPromiseRejectionTracking: true,
      }
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView(); // Track the initial page view

    console.log('Application Insights initialized successfully');
    return appInsights;
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
    return null;
  }
};

export const getAppInsights = (): ApplicationInsights | null => {
  return appInsights;
};

export const trackException = (error: Error, severityLevel?: number) => {
  if (appInsights) {
    appInsights.trackException({
      exception: error,
      severityLevel: severityLevel
    });
  }
};

export const trackEvent = (name: string, properties?: { [key: string]: any }) => {
  if (appInsights) {
    appInsights.trackEvent({
      name: name,
      properties: properties
    });
  }
};

export const trackPageView = (name?: string, url?: string) => {
  if (appInsights) {
    appInsights.trackPageView({
      name: name,
      uri: url
    });
  }
};
