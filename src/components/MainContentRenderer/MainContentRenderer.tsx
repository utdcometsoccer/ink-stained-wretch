import React from 'react';
import { AuthGuard } from '../AuthGuard';
import { AuthorRegistration } from '../AuthorRegistration';
import { ChooseCulture } from '../ChooseCulture';
import { DomainRegistration } from '../DomainRegistration';
import { ErrorPage } from '../ErrorPage';
import { Login } from '../LoginRegister';
import { Subscribe } from '../Subscribe';
import { ThankYou } from '../ThankYou';
import { trackException } from '../../services/applicationInsights';
import type { MainContentRendererProps } from './MainContentRendererProps';

export const MainContentRenderer: React.FC<MainContentRendererProps> = ({
  currentUIState,
  state,
  dispatch,
  isDevelopment
}) => {
  const renderCurrentComponent = () => {
    try {
      switch (currentUIState) {
        case 'chooseCulture':
          return <ChooseCulture state={state} dispatch={dispatch} />
        case 'login':
          return <Login state={state} dispatch={dispatch} />
        case 'domainRegistration':
          return (
            <AuthGuard>
              <DomainRegistration state={state} dispatch={dispatch} />
            </AuthGuard>
          )
        case 'authorPage':
          return (
            <AuthGuard>
              <AuthorRegistration state={state} dispatch={dispatch} culture={state.cultureInfo?.Culture} />
            </AuthGuard>
          )
        case 'subscribe':
          return (
            <AuthGuard>
              <Subscribe state={state} dispatch={dispatch} culture={state.cultureInfo?.Culture} />
            </AuthGuard>
          )
        case 'thankYou':
          return (
            <AuthGuard>
              <ThankYou />
            </AuthGuard>
          )
        case 'error':
          return <ErrorPage state={state} dispatch={dispatch} isDevelopment={isDevelopment} culture={state.cultureInfo?.Culture} />
        default:
          return <ErrorPage state={state} dispatch={dispatch} isDevelopment={isDevelopment} culture={state.cultureInfo?.Culture} />
      }
    } catch (error) {
      const renderError = error instanceof Error ? error : new Error('An error occurred while rendering');
      trackException(renderError, 3); // Error severity level
      dispatch({
        type: 'SET_ERROR',
        payload: renderError.message
      })
      return <ErrorPage state={state} dispatch={dispatch} isDevelopment={isDevelopment} culture={state.cultureInfo?.Culture} />
    }
  };

  return renderCurrentComponent();
};