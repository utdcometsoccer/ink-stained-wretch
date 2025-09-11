# DomainRegistration API Documentation

## Overview
This REST API provides access to a list of domain registration objects. Authentication is handled via Microsoft Entra ID (Azure AD) using OAuth 2.0. Only authenticated users with the appropriate permissions can access the endpoints.

## Authentication
- **Protocol:** OAuth 2.0 (OpenID Connect)
- **Provider:** Microsoft Entra ID (Azure AD)
- **Flow:** Authorization Code or Client Credentials
- **Scopes:** `api://<your-api-client-id>/DomainRegistration.Read`

## Endpoints
### GET /api/domain-registrations
Returns a list of domain registration objects.

#### Request
```
GET /api/domain-registrations
Authorization: Bearer <access_token>
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json
[
  {
    "id": "string",
    "domain": {
      "topLevelDomain": "string",
      "secondLevelDomain": "string"
    },
    "contactInformation": {
      "firstName": "string",
      "lastName": "string",
      "address": "string",
      "address2": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "zipCode": "string",
      "emailAddress": "string",
      "telephoneNumber": "string"
    }
  },
  // ...more objects
]
```

## Error Codes
- `401 Unauthorized`: Invalid or missing access token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Unexpected error

## Example Usage
See `src/hooks/useFetchDomainRegistrations.ts` for a sample function to authenticate and fetch data from this API.

## Security
- All requests must use HTTPS.
- Access tokens must be obtained from Microsoft Entra ID.
- Do not expose client secrets in client-side code.

## Contact
For questions or support, contact the API administrator.
