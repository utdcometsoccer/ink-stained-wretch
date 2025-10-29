# GitHub Secrets Setup Checklist

This checklist helps you configure all required secrets for the Azure Static Web Apps CI/CD pipeline.

## Required Secrets

Add these secrets in: **GitHub Repository → Settings → Secrets and variables → Actions**

### 1. Azure Deployment Token
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` - Get from Azure Portal after creating Static Web App

### 2. Authentication & Security (Microsoft Entra ID)
- [ ] `VITE_ENTRA_CLIENT_ID` - Azure AD App Registration Client ID
- [ ] `VITE_ENTRA_TENANT_ID` - Azure AD Tenant ID
- [ ] `VITE_ENTRA_AUTHORITY` - Format: `https://login.microsoftonline.com/{tenant-id}`
- [ ] `VITE_ENTRA_SCOPES` - Format: `api://your-app-id/.default`

### 3. API Endpoints
- [ ] `VITE_SUBSCRIPTION_PLANS_API_URL` - Subscription plans API endpoint
- [ ] `VITE_AUTHOR_API_BASE_URL` - Author management API base URL
- [ ] `VITE_IMAGE_API_URL` - Image upload/management API endpoint
- [ ] `VITE_USER_DOMAIN_REGISTRATIONS_API_URL` - Domain registrations GET endpoint
- [ ] `VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL` - Domain registrations POST endpoint
- [ ] `VITE_LANGUAGES_API_URL` - Languages data API endpoint
- [ ] `VITE_STATES_PROVINCES_API_URL` - States/provinces data API endpoint
- [ ] `VITE_LOCALIZATION_API_URL` - Localization API endpoint

### 4. External API Integrations
- [ ] `VITE_PENGUIN_RANDOM_HOUSE_API_URL` - Penguin Random House API endpoint
- [ ] `VITE_PENGUIN_RANDOM_HOUSE_API_KEY` - Penguin Random House API key
- [ ] `VITE_AMAZON_BOOKS_API_URL` - Amazon Books API proxy endpoint

### 5. Payment Processing (Stripe)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_... or pk_live_...)
- [ ] `VITE_STRIPE_CHECKOUT_SESSION_URL` - Azure Function URL for checkout session
- [ ] `VITE_STRIPE_CREATE_CUSTOMER_URL` - Azure Function URL for customer creation
- [ ] `VITE_STRIPE_CREATE_SUBSCRIPTION_URL` - Azure Function URL for subscription creation
- [ ] `VITE_ENABLE_STRIPE_CHECKOUT` - Set to `true` or `false`

### 6. Monitoring & Analytics
- [ ] `VITE_APPLICATION_INSIGHTS_CONNECTION_STRING` - Azure Application Insights connection string

### 7. Feature Configuration
- [ ] `VITE_APP_NAME` - Application display name (e.g., "Ink Stained Wretch")
- [ ] `VITE_CONTACT_EMAIL` - Support/contact email address
- [ ] `VITE_BOOK_DESCRIPTION_LIMIT` - Character limit for book descriptions (e.g., "300")
- [ ] `VITE_SUBSCRIPTION_PLANS_MAX_PAGES` - Max pages for subscription plans (e.g., "5")
- [ ] `VITE_COUNTDOWN_SECONDS` - Login redirect countdown in seconds (e.g., "10")
- [ ] `VITE_ENABLE_AMAZON_IMPORT` - Set to `true` or `false`

## Notes

### Public URLs (No Secrets Needed)
These are hardcoded in the workflow file and don't need secrets:
- `VITE_OPENLIBRARY_AUTHOR_SEARCH_URL` → `https://openlibrary.org/search/authors.json?q=`
- `VITE_GOOGLE_BOOKS_API_URL` → `https://www.googleapis.com/books/v1/volumes`
- `VITE_WHOIS_API_URL` → `https://api.whois.vu`

### Optional Secrets
If these are not set, the application will use defaults or disable features:
- Feature flags (can default to `false` if not set)
- Limits/timeouts (have reasonable defaults in code)

### Security Best Practices
- ✅ Never commit secrets to the repository
- ✅ Use different values for development vs production
- ✅ Rotate secrets regularly
- ✅ Use test keys for Stripe in non-production environments
- ✅ Limit secret access to required personnel only

### Verification
After adding all secrets:
1. Push a commit to main branch
2. Check GitHub Actions tab for workflow run
3. Review build logs for any missing environment variables
4. Verify deployment succeeded in Azure Portal

## Getting Help

- See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for detailed setup instructions
- Check [README.md](README.md#environment-configuration) for environment variable details
- Review Azure Static Web Apps documentation for troubleshooting
