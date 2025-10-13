import { MsalProvider } from "@azure/msal-react";
import { CircularProgress } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import type { Stripe } from "@stripe/stripe-js";
import './App.css';
import { Container } from "./components/Container";
import { ErrorBoundary } from './components/ErrorBoundary';
import { MainContentRenderer } from './components/MainContentRenderer';
import { Navbar } from './components/Navbar';
import { CultureInfoProvider } from './contexts/CultureInfoContext';
import { useAppLogic } from './hooks/useAppLogic';
import { LocalizationContext } from "./LocalizationContext";
import { getDefaultLocale } from "./services/getDefaultLocale";
import { isDevelopment } from './services/isDevelopment';
import { msalInstance } from "./services/msalConfig";
import { stripePromise } from "./services/stripeClient";

function App() {
  const { appState, dispatch, handleReactError } = useAppLogic();
  const { loading, localizationData } = appState.state
  
  return loading ? (
    <CircularProgress />
  ) : (
    <MsalProvider instance={msalInstance}>
      <ErrorBoundary onError={handleReactError}>
        <CultureInfoProvider cultureInfo={appState.state.cultureInfo}>
          <LocalizationContext.Provider value={localizationData || getDefaultLocale()}>
            <Elements stripe={stripePromise as unknown as Stripe | null}>
              <div className="app">
                <Navbar currentState={appState.currentUIState} dispatch={dispatch} state={appState.state} />
                <main className="app-content">
                  <Container>
                    <MainContentRenderer 
                      currentUIState={appState.currentUIState}
                      state={appState.state}
                      dispatch={dispatch}
                      isDevelopment={isDevelopment}
                    />
                  </Container>
                </main>
              </div>
            </Elements>
          </LocalizationContext.Provider>
        </CultureInfoProvider>
      </ErrorBoundary>
    </MsalProvider>
  )
};

export default App

