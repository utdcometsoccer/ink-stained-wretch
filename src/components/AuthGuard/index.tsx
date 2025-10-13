import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import type { FC } from 'react';
import { useLoginLogic } from '../../hooks/useLoginLogic';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import './AuthGuard.css';
import type { AuthGuardProps } from './AuthGuardProps';

export const AuthGuard: FC<AuthGuardProps> = ({ children, unauthenticatedContent }) => {
  const { AuthGuard: { title, message, buttonLabel } } = useLocalizationContext();
  const { handleSignIn } = useLoginLogic(() => {});
  
  useTrackComponent('AuthGuard', { hasCustomUnauthenticatedContent: !!unauthenticatedContent });

  const defaultUnauthenticatedContent = (
    <div className="auth-guard-unauthenticated">
      <h2 className="auth-guard-title">{title}</h2>
      <p className="auth-guard-message">
        {message}
      </p>
      <button className="auth-guard-login-btn" onClick={handleSignIn}>
        {buttonLabel}
      </button>
    </div>
  );

  return (
    <>
      <AuthenticatedTemplate>
        {children}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {unauthenticatedContent || defaultUnauthenticatedContent}
      </UnauthenticatedTemplate>
    </>
  );
};