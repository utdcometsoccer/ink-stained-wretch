import { MsalProvider } from "@azure/msal-react";
import { CircularProgress } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import type { Stripe } from "@stripe/stripe-js";
import './App.css';
import { AuthorRegistration } from './components/AuthorRegistration';
import { ChooseCulture } from "./components/ChooseCulture";
import { DomainRegistration } from './components/DomainRegistration';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorPage } from './components/ErrorPage';
import { Login } from './components/LoginRegister';
import { Navbar } from './components/Navbar';
import { ThankYou } from './components/ThankYou';
import { LocalizationContext } from "./LocalizationContext";
import { isDevelopment } from './services/isDevelopment';
import { trackException } from './services/applicationInsights';
import { msalInstance } from "./services/msalConfig";

import { useAppLogic } from './hooks/useAppLogic';
import Subscribe from "./components/Subscribe";
import { stripePromise } from "./services/stripeClient";
function App() {
  const { appState, dispatch, localized, loading, handleReactError } = useAppLogic();

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
        case 'subscribe':
          return <Subscribe state={appState.state} dispatch={dispatch} culture={appState.state.cultureInfo?.Culture} />
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
  };
  return loading ? (
    <CircularProgress />
  ) : (
    <MsalProvider instance={msalInstance}>
      <ErrorBoundary onError={handleReactError}>
        <LocalizationContext value={localized}>
          <Elements stripe={stripePromise as unknown as Stripe | null}>
            <div className="app">
              <Navbar currentState={appState.currentUIState} dispatch={dispatch} state={appState.state} />
              <main className="app-content">
                {renderCurrentComponent()}
              </main>
            </div>
            </Elements>
        </LocalizationContext>
      </ErrorBoundary>
    </MsalProvider>
  )
};

export default App

