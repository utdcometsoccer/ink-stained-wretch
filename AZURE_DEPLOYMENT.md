# Azure Static Web Apps Deployment Guide

This guide explains how to deploy the Ink Stained Wretch application to Azure Static Web Apps using the automated CI/CD pipeline.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Azure Static Web Apps Setup](#azure-static-web-apps-setup)
- [GitHub Repository Configuration](#github-repository-configuration)
- [Environment Variables and Secrets](#environment-variables-and-secrets)
- [Deployment Process](#deployment-process)
- [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)

## Prerequisites

1. **Azure Account**: Active Azure subscription ([Create free account](https://azure.microsoft.com/free/))
2. **GitHub Account**: Repository access with admin permissions
3. **Azure CLI** (optional): For command-line management ([Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli))

## Azure Static Web Apps Setup

### Option 1: Azure Portal (Recommended for First-Time Setup)

1. **Navigate to Azure Portal**
   - Go to [Azure Portal](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create Static Web App**
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Configure Basic Settings**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Name**: Choose a unique name (e.g., `ink-stained-wretch-app`)
   - **Plan Type**: 
     - Free: For development/testing
     - Standard: For production with custom domains
   - **Region**: Choose closest to your users
   - **Deployment Source**: GitHub

4. **Configure GitHub Integration**
   - Click "Sign in with GitHub"
   - Authorize Azure Static Web Apps
   - **Organization**: Select your organization
   - **Repository**: Select `ink-stained-wretch`
   - **Branch**: Select `main`

5. **Build Details**
   - **Build Presets**: Select "React"
   - **App location**: `/` (root directory)
   - **Api location**: Leave empty (no Azure Functions API)
   - **Output location**: `dist`

6. **Review and Create**
   - Click "Review + create"
   - Verify settings
   - Click "Create"

7. **Get Deployment Token**
   - After creation, navigate to your Static Web App resource
   - Go to "Overview" section
   - Click "Manage deployment token"
   - Copy the token (you'll need this for GitHub secrets)

### Option 2: Azure CLI

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name ink-stained-wretch-rg --location eastus

# Create Static Web App
az staticwebapp create \
  --name ink-stained-wretch-app \
  --resource-group ink-stained-wretch-rg \
  --source https://github.com/YOUR_USERNAME/ink-stained-wretch \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github

# Get deployment token
az staticwebapp secrets list \
  --name ink-stained-wretch-app \
  --resource-group ink-stained-wretch-rg \
  --query "properties.apiKey" -o tsv
```

## GitHub Repository Configuration

### 1. Add Azure Deployment Token

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: Paste the deployment token from Azure

### 2. Configure Environment Variables

Add the following secrets in GitHub (Settings > Secrets and variables > Actions):

#### Required Secrets

**Authentication & Security**
```
VITE_ENTRA_CLIENT_ID
VITE_ENTRA_TENANT_ID
VITE_ENTRA_AUTHORITY
VITE_ENTRA_SCOPES
```

**API Endpoints**
```
VITE_SUBSCRIPTION_PLANS_API_URL
VITE_AUTHOR_API_BASE_URL
VITE_IMAGE_API_URL
VITE_USER_DOMAIN_REGISTRATIONS_API_URL
VITE_DOMAIN_REGISTRATION_SUBMIT_API_URL
VITE_LANGUAGES_API_URL
VITE_STATES_PROVINCES_API_URL
VITE_LOCALIZATION_API_URL
```

**External APIs**
```
VITE_PENGUIN_RANDOM_HOUSE_API_URL
VITE_PENGUIN_RANDOM_HOUSE_API_KEY
VITE_AMAZON_BOOKS_API_URL
```

**Payment Processing**
```
VITE_STRIPE_PUBLISHABLE_KEY
VITE_STRIPE_CHECKOUT_SESSION_URL
VITE_STRIPE_CREATE_CUSTOMER_URL
VITE_STRIPE_CREATE_SUBSCRIPTION_URL
VITE_ENABLE_STRIPE_CHECKOUT
```

**Monitoring**
```
VITE_APPLICATION_INSIGHTS_CONNECTION_STRING
```

**Feature Configuration**
```
VITE_APP_NAME
VITE_CONTACT_EMAIL
VITE_BOOK_DESCRIPTION_LIMIT
VITE_SUBSCRIPTION_PLANS_MAX_PAGES
VITE_COUNTDOWN_SECONDS
VITE_ENABLE_AMAZON_IMPORT
```

#### Optional Secrets (Use defaults if not set)

Some environment variables have default values or are optional:
- Public API URLs (OpenLibrary, Google Books, WHOIS) are hardcoded in the workflow
- Feature flags can use defaults if not specified

### 3. Verify Workflow File

The workflow file is located at `.github/workflows/azure-static-web-apps.yml` and includes:

- **Triggers**: Automatic deployment on push to `main` and PR events
- **Build Steps**: Node.js 22.x setup, dependency installation, and build
- **Environment Variables**: All secrets injected during build
- **Deployment**: Automated deployment to Azure Static Web Apps
- **PR Cleanup**: Automatic removal of preview environments when PRs close

## Environment Variables and Secrets

### Setting Up Secrets in GitHub

1. **Navigate to Repository Settings**
   ```
   GitHub Repository > Settings > Secrets and variables > Actions
   ```

2. **Add Each Secret**
   - Click "New repository secret"
   - Enter the secret name (exactly as shown in the list above)
   - Paste the secret value
   - Click "Add secret"

3. **Verify Secrets**
   - All secrets should be visible in the Actions secrets list
   - Secret values are hidden for security

### Getting Secret Values

#### Microsoft Entra ID (Azure AD)
1. Go to Azure Portal > Azure Active Directory > App registrations
2. Select your application or create new
3. Get `Client ID` from Overview page
4. Get `Tenant ID` from Overview page
5. Create or use existing client secret
6. Configure redirect URIs for your Static Web App domain

#### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy Publishable key (starts with `pk_`)
4. Set up backend Azure Functions for checkout sessions
5. Get Function URLs for checkout, customer, and subscription endpoints

#### Application Insights
1. Go to Azure Portal > Application Insights
2. Create new instance or use existing
3. Copy connection string from Overview page

#### Custom APIs
- Set up your Azure Functions or backend APIs
- Configure CORS to allow your Static Web App domain
- Copy Function URLs or API Gateway URLs

## Deployment Process

### Automatic Deployment

The CI/CD pipeline automatically deploys when:

1. **Push to Main Branch**
   - Commits pushed to `main` trigger automatic deployment
   - Build runs on Node.js 22.x
   - App deployed to production environment

2. **Pull Requests**
   - Opening a PR creates a staging/preview environment
   - Each commit to the PR updates the preview
   - Preview URL provided in PR comments
   - Preview environment deleted when PR closes

### Manual Deployment

To manually trigger a deployment:

1. Navigate to repository Actions tab
2. Select "Azure Static Web Apps CI/CD" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Monitoring Deployment

1. **GitHub Actions**
   - Go to repository > Actions tab
   - View workflow runs and logs
   - Check for build errors or deployment issues

2. **Azure Portal**
   - Navigate to your Static Web App resource
   - Check "Environments" for active deployments
   - View deployment history and logs
   - Monitor application metrics

## Monitoring and Troubleshooting

### Common Issues

#### Build Failures

**TypeScript Compilation Errors**
- Check workflow logs for specific TypeScript errors
- Verify all types are correctly defined
- Fix any type mismatches before merging to main

**Missing Dependencies**
- Ensure `package.json` and `package-lock.json` are committed
- Verify all dependencies are listed

**Environment Variables**
- Verify all required secrets are set in GitHub
- Check for typos in secret names
- Ensure secret values are correct

#### Deployment Failures

**Invalid Deployment Token**
- Regenerate token in Azure Portal
- Update `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub

**Build Artifact Issues**
- Verify build creates `dist` folder
- Check output location in workflow matches Vite config

### Viewing Logs

**GitHub Actions Logs**
```
Repository > Actions > Select workflow run > View logs
```

**Azure Static Web Apps Logs**
```
Azure Portal > Static Web App > Monitoring > Logs
```

### Testing Deployment

1. **Access Your Application**
   - Production URL: `https://<app-name>.azurestaticapps.net`
   - Custom domain: Configure in Azure Portal

2. **Verify Functionality**
   - Test authentication flows
   - Verify API connections
   - Check payment integration
   - Test all major features

3. **Monitor Performance**
   - Use Application Insights for telemetry
   - Check response times and error rates
   - Monitor user interactions

### Custom Domain Setup

1. **Azure Portal Configuration**
   - Navigate to Static Web App > Custom domains
   - Click "Add"
   - Choose "Custom domain on any DNS provider"
   - Follow verification steps

2. **DNS Configuration**
   - Add CNAME record pointing to Static Web App URL
   - Add TXT record for domain verification
   - Wait for DNS propagation (up to 48 hours)

3. **SSL Certificate**
   - Azure automatically provisions free SSL certificate
   - Certificate renews automatically

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [React Production Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)

## Support

For issues or questions:
- Check [Azure Static Web Apps Troubleshooting](https://docs.microsoft.com/azure/static-web-apps/troubleshooting)
- Review GitHub Actions logs
- Contact support through Azure Portal

---

*Last updated: January 2025*
