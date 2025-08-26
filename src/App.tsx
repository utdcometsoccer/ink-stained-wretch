import { useReducer, useEffect } from 'react'
import './App.css'
import { appReducer, initialState } from './reducers/appReducer'
import { Login } from './components/LoginRegister'
import { DomainRegistration } from './components/DomainRegistration'
import { AuthorPage } from './components/AuthorPage'
import { ChooseSubscription } from './components/ChooseSubscription'
import { Checkout } from './components/Checkout'
import { ThankYou } from './components/ThankYou'
import { ErrorPage } from './components/ErrorPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/Navbar'
import { initializeAppInsights, trackException, trackEvent, trackPageView } from './services/applicationInsights'
import { ChooseCulture } from './components/ChooseCulture/index'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./services/msalConfig";

function App() {
  const [appState, dispatch] = useReducer(appReducer, initialState)

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
  }, [])

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
          return <AuthorPage state={appState.state} dispatch={dispatch} />
        case 'chooseSubscription':
          return <ChooseSubscription state={appState.state} dispatch={dispatch} />
        case 'checkout':
          return <Checkout state={appState.state} dispatch={dispatch} />
        case 'thankYou':
          return <ThankYou state={appState.state} dispatch={dispatch} />
        case 'error':
          return <ErrorPage state={appState.state} dispatch={dispatch} />
        default:
          return <ErrorPage state={appState.state} dispatch={dispatch} />
      }
    } catch (error) {
      const renderError = error instanceof Error ? error : new Error('An error occurred while rendering');
      trackException(renderError, 3); // Error severity level
      dispatch({
        type: 'SET_ERROR',
        payload: renderError.message
      })
      return <ErrorPage state={appState.state} dispatch={dispatch} />
    }
  }

  return (
    <MsalProvider instance={msalInstance}>
      <ErrorBoundary onError={handleReactError}>
        <div className="app">
          <Navbar currentState={appState.currentUIState} dispatch={dispatch} state={appState.state} />
          <main className="app-content">
            {renderCurrentComponent()}
          </main>
        </div>
      </ErrorBoundary>
    </MsalProvider>
  )
}

export default App
