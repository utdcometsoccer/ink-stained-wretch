import { MsalProvider } from "@azure/msal-react";
import { useEffect, useReducer } from 'react';
import './App.css';
import { AuthorRegistration } from './components/AuthorRegistration';
import { Checkout } from './components/Checkout';
import { ChooseCulture } from "./components/ChooseCulture";
import ChooseSubscription from "./components/ChooseSubscription";
import { DomainRegistration } from './components/DomainRegistration';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorPage } from './components/ErrorPage';
import { Login } from './components/LoginRegister';
import { Navbar } from './components/Navbar';
import { ThankYou } from './components/ThankYou';
import { useGetLocalizedText } from "./hooks/useGetLocalizedText";
import { LocalizationContext } from "./LocalizationContext";
import { appReducer } from './reducers/appReducer';
import { initializeAppInsights, trackEvent, trackException, trackPageView } from './services/applicationInsights';
import { getDefaultLocale } from "./services/getDefaultLocale";
import { isDevelopment } from './services/isDevelopment';
import { loadStateFromCookie } from './services/loadStateFromCookie';
import { msalInstance } from "./services/msalConfig";

function App() {
  const [appState, dispatch] = useReducer(appReducer, loadStateFromCookie())

  // Initialize Application Insights
  useEffect(() => {
    initializeAppInsights();
    trackEvent('App_Initialized', {
      initialState: appState.currentUIState,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Track UI state changes
  useEffect(() => {
    trackPageView(`${appState.currentUIState}`, window.location.href);
    trackEvent('UI_State_Changed', {
      newState: appState.currentUIState,
      timestamp: new Date().toISOString()
    });
  }, [appState.currentUIState]);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.error?.message || 'An unexpected error occurred');
      trackException(error, 3); // Error severity level
      dispatch({
        type: 'SET_ERROR',
        payload: error.message
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error(event.reason?.message || 'An unhandled promise rejection occurred');
      trackException(error, 3); // Error severity level
      dispatch({
        type: 'SET_ERROR',
        payload: error.message
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, []);

  const culture = appState.state.cultureInfo?.Culture || 'en-us';
  const localized = useGetLocalizedText(culture) || getDefaultLocale();  

  const handleReactError = (error: Error) => {
    trackException(error, 3); // Error severity level
    dispatch({
      type: 'SET_ERROR',
      payload: error.message || 'A React component error occurred'
    })
  }

  const renderCurrentComponent = () => {
    try {
      switch (appState.currentUIState) {
        case 'chooseCulture':
          return <ChooseCulture state={appState.state} dispatch={dispatch} />
        case 'login':
          return <Login state={appState.state} dispatch={dispatch} />
        case 'domainRegistration':
          return <DomainRegistration state={appState.state} dispatch={dispatch} />
        case 'authorPage':
          return <AuthorRegistration state={appState.state} dispatch={dispatch} culture={appState.state.cultureInfo?.Culture} />
        case 'chooseSubscription':
          return <ChooseSubscription state={appState.state} dispatch={dispatch} culture={appState.state.cultureInfo?.Culture} />
        case 'checkout':
          return import.meta.env.VITE_ENABLE_STRIPE_CHECKOUT ? <Checkout state={appState.state} /> : <h2>Stripe Checkout is disabled</h2>
        case 'thankYou':
          return <ThankYou />
        case 'error':
          return <ErrorPage state={appState.state} dispatch={dispatch} isDevelopment={isDevelopment} culture={appState.state.cultureInfo?.Culture} />
        default:
          return <ErrorPage state={appState.state} dispatch={dispatch} isDevelopment={isDevelopment} culture={appState.state.cultureInfo?.Culture} />
      }
    } catch (error) {
      const renderError = error instanceof Error ? error : new Error('An error occurred while rendering');
      trackException(renderError, 3); // Error severity level
      dispatch({
        type: 'SET_ERROR',
        payload: renderError.message
      })
      return <ErrorPage state={appState.state} dispatch={dispatch} isDevelopment={isDevelopment} culture={appState.state.cultureInfo?.Culture} />
    }
  }

  return (
    <MsalProvider instance={msalInstance}>
      <ErrorBoundary onError={handleReactError}>
        <LocalizationContext value={localized}>
          <div className="app">
            <Navbar currentState={appState.currentUIState} dispatch={dispatch} state={appState.state} />
            <main className="app-content">
              {renderCurrentComponent()}
            </main>
          </div>
        </LocalizationContext>
      </ErrorBoundary>
    </MsalProvider>
  )
}

export default App
