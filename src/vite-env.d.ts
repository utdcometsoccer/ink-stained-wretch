/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLICATION_INSIGHTS_CONNECTION_STRING: string;
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  readonly VITE_ENTRA_POLICY: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  readonly VITE_ENTRA_SCOPES: string;
  readonly VITE_COUNTDOWN_SECONDS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
