# Author API Documentation

## Overview
This REST API provides access to a list of author objects for a given domain. Authentication is handled via Microsoft Entra ID (Azure AD) using OAuth 2.0. Only authenticated users with the appropriate permissions can access the endpoints.

## Authentication
- **Protocol:** OAuth 2.0 (OpenID Connect)
- **Provider:** Microsoft Entra ID (Azure AD)
- **Flow:** Authorization Code or Client Credentials
- **Scopes:** `api://<your-api-client-id>/Author.Read`

## Endpoints
### GET /api/authors/{secondLevelDomain}/{topLevelDomain}
Returns a list of author objects for the specified domain.

#### Request
```
GET /api/authors/{secondLevelDomain}/{topLevelDomain}
Authorization: Bearer <access_token>
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json
[
  {
    "id": "string",
    "AuthorName": "string",
    "LanguageName": "string",
    "RegionName": "string",
    "EmailAddress": "string",
    "WelcomeText": "string",
    "AboutText": "string",
    "HeadShotURL": "string",
    "CopyrightText": "string",
    "TopLevelDomain": "string",
    "SecondLevelDomain": "string",
    "Articles": [],
    "Books": [],
    "Socials": []
  },
  // ...more objects
]
```

## Error Codes
- `401 Unauthorized`: Invalid or missing access token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Domain not found
- `500 Internal Server Error`: Unexpected error

## Example Usage
See `src/services/fetchAuthorsByDomain.ts` for a sample function to authenticate and fetch data from this API.

## Security
- All requests must use HTTPS.
- Access tokens must be obtained from Microsoft Entra ID.
- Do not expose client secrets in client-side code.

## Contact
For questions or support, contact the API administrator.
