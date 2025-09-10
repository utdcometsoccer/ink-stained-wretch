# Ink-Stained Wretch Localization REST API

This API provides localized UI text for the Ink-Stained Wretch application. It returns a `LocalizedText` object for the requested language and region, or `null` if not available.

## Endpoint

```
GET /api/localization/:language-:region
```

- `:language` — ISO 639-1 language code (e.g., `en`, `es`, `fr`, `ar`, `zh`)
- `:region` — ISO 3166-1 alpha-2 country code (e.g., `US`, `MX`, `CA`, `EG`, `TW`)

### Example Requests

- `GET /api/localization/en/US`
- `GET /api/localization/es/MX`
- `GET /api/localization/fr/CA`
- `GET /api/localization/ar/EG`
- `GET /api/localization/zh/TW`

## Response

### Success
```json
{
  "LoginRegister": { ... },
  "ThankYou": { ... },
  "Navbar": { ... },
  // ...other sections
}
```

### Not Found
```json
null
```

## Error Codes
- `404 Not Found` — No localization available for the requested language-region
- `500 Internal Server Error` — Unexpected server error

## Notes
- The returned object matches the TypeScript `LocalizedText` interface.
- If a requested language-region is not supported, the API returns `null`.
- For best results, always use valid language and region codes.

---

**Contact:** For questions or issues, contact the Ink-Stained Wretch development team.
