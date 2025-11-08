import { trackEvent } from "./applicationInsights";

export function trackComponent(componentName: string, props: Record<string, unknown>) {
  trackEvent('Component Loaded', { 
        component: componentName,
        props: props,
        timestamp: new Date().toISOString()
      });
}