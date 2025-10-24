/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPLICATION_INSIGHTS_CONNECTION_STRING: string;
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  readonly VITE_ENTRA_POLICY: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  readonly VITE_ENTRA_SCOPES: string;
  readonly VITE_COUNTDOWN_SECONDS: string;
  readonly VITE_SUBSCRIPTION_PLANS_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_OPENLIBRARY_AUTHOR_SEARCH_URL: string;
  readonly VITE_GOOGLE_BOOKS_API_URL: string;
  readonly VITE_IMAGE_UPLOAD_API_URL: string;
  readonly VITE_IMAGE_USER_API_URL: string;
  readonly VITE_IMAGE_DELETE_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_CHECKOUT_SESSION_URL: string;
  readonly VITE_STRIPE_CREATE_CUSTOMER_URL: string;
  readonly VITE_STRIPE_LOGO_URL: string;
  readonly VITE_STRIPE_CREATE_SUBSCRIPTION_URL: string;
  readonly VITE_ENABLE_STRIPE_CHECKOUT: boolean;
  readonly VITE_API_URL: string;
  readonly VITE_USER_DOMAIN_REGISTRATIONS_API_URL: string;
  readonly VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL: string;
  readonly VITE_LOCALIZATION_API_URL: string;
  readonly VITE_WHOIS_API_URL: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_API_URL: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_API_KEY: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_API_DOMAIN: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_SEARCH_API: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_URL: string;
  readonly VITE_SUBSCRIPTION_PLANS_MAX_PAGES: string;
  readonly VITE_BOOK_DESCRIPTION_LIMIT: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_SEARCH_AUTHORS_API_URL: string;
  readonly VITE_PENGUIN_RANDOM_HOUSE_TITLES_BY_AUTHOR_API_URL: string;
  readonly VITE_AMAZON_BOOKS_API_URL: string;
  readonly VITE_ENABLE_AMAZON_IMPORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
