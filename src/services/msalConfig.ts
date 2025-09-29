import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID,
    authority: import.meta.env.VITE_ENTRA_AUTHORITY,
    redirectUri: window.location.origin,
  },
  // Only support Personal Microsoft Accounts (MSA)
  // No knownAuthorities needed for consumers endpoint
};

const scopeArray = import.meta.env.VITE_ENTRA_SCOPES.split(",");
export const msalInstance = new PublicClientApplication(msalConfig);
export const loginRequest = {
  scopes: scopeArray,
  authority: import.meta.env.VITE_ENTRA_AUTHORITY  
};