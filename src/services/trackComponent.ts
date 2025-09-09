import { trackEvent } from "./applicationInsights";

export function trackComponent(componentName: string, props: any) {
  trackEvent('Component Loaded', { 
        component: componentName,
        props: props,
        timestamp: new Date().toISOString()
      });
}