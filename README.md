# Ink Stained Wretch

A modular, type-safe author platform built with React, TypeScript, and Vite. This project features robust state management, culture selection, and integrated telemetry using Microsoft Application Insights.


A modular React/TypeScript author platform for managing authors, books, articles, and social media links. Built with Vite, Material UI icons, and robust local reducer logic for maintainable state management and a polished UI.

## Features

- **Modular architecture:** Components for AuthorForm, BookList, ArticleList, SocialList, AuthorRegistration
- **Local reducer hooks:** Advanced state management for forms and lists
- **Material UI icons:** Edit, Delete, Add, ArrowForward for all action buttons
- **Inline action buttons:** Text and icons displayed inline with data
- **Thumbnails & previews:**
	- Author list shows small headshot thumbnails (HeadshotURL)
	- Book list shows rectangular cover thumbnails (CoverURL) with rounded edges
	- HeadshotURL field displays a small image thumbnail next to the image manager button; hover shows a larger preview
- **Utility CSS classes:**
	- `.input-fullwidth` (100% width)
	- `.input-two-thirds-width` (66% width, box-sizing: border-box)
- **Consistent button row & alignment classes:** For forms and lists
- **Robust reducer logic:**
	- `SAVE_AUTHOR` action replaces or adds author by id
	- Cancel/delete logic for child forms
- **Vite-powered:** Fast development and build

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server

## Project Structure

```
src/
	App.tsx
	App.css
	main.tsx
	assets/
		react.svg
	types/
		UIStates.ts
	AuthorForm.tsx
	BookList.tsx
	ArticleList.tsx
	SocialList.tsx
	AuthorRegistration/
		index.tsx
public/
	vite.svg
eslint.config.js
index.html
package.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
README.md
```

## Key Components & Logic

### AuthorForm
- Local reducer for form state
- Thumbnail and hover preview for HeadshotURL
- Inline action buttons with Material UI icons
- Button row styling

### BookList
- Book cover thumbnail with rounded edges
- Inline action buttons with icons

### ArticleList & SocialList
- Inline action buttons with Material UI icons

### AuthorRegistration
- Author list with headshot thumbnail, inline action buttons, and button row styling
- Uses SAVE_AUTHOR logic to replace or add authors by id

### Reducer Logic
- `SAVE_AUTHOR` action: Checks for existing author by id and replaces, otherwise adds
- Robust cancel/delete logic for child items

### Styling
- Utility classes:
	- `.input-fullwidth`: 100% width
	- `.input-two-thirds-width`: 66% width, box-sizing: border-box
- Button row and alignment classes for consistent UI
- Thumbnail and preview image styles for authors and books

## Usage

1. Add/Edit authors, books, articles, and social media links using the modular forms
2. Use the HeadshotURL and CoverURL fields to display thumbnails and previews
3. Action buttons (Edit, Delete, Add) are inline with data and use Material UI icons
4. Input fields use utility width classes for responsive layout

## Dependencies

- React 18+
- TypeScript
- Vite
- @mui/icons-material (Material UI icons)

## Development

```sh
npm install
npm run dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
│   │   │   ├── index.tsx
│   │   │   ├── Navbar.css
│   │   │   ├── NavbarProps.tsx
│   │   │   ├── NavItem.tsx
│   │   │   └── navItems.tsx
│   │   ├── ThankYou.tsx
│   │   ├── ThankYouProps.tsx
│   ├── constants/
│   │   ├── regionNames.ts
│   │   └── stateProvinceNames.ts
│   ├── reducers/
│   │   └── appReducer.ts
│   ├── services/
│   │   ├── applicationInsights.ts
│   │   ├── domainRegex.ts
│   │   ├── domainValidate.ts
│   │   ├── extractSelectedRegion.ts
│   │   ├── getLanguageFromCulture.ts
│   │   ├── getRegionFromCulture.ts
│   │   ├── getStateProvinceOptions.ts
│   │   ├── isValidCulture.ts
│   │   ├── isValidLanguage.ts
│   │   ├── isValidRegion.ts
│   │   ├── msalConfig.ts
│   │   ├── validateDomainWhois.ts
│   │   ├── validateEmail.ts
│   │   └── validatePhone.ts
│   ├── types/
│   │   ├── Article.ts
│   │   ├── Author.ts
│   │   ├── Book.ts
│   │   ├── ContactInformation.ts
│   │   ├── Culture.ts
│   │   ├── Domain.ts
│   │   ├── DomainRegistration.ts
│   │   ├── Language.ts
│   │   ├── LoginAction.ts
│   │   ├── LoginLogicResult.ts
│   │   ├── Region.ts
│   │   ├── Social.ts
│   │   ├── SocialLink.ts
│   │   ├── State.ts
│   │   ├── UIStates.ts
│   │   ├── UserProfile.ts
│   │   └── WhoisResult.ts
│   └── tests/
│       └── isValidCulture.test.ts
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── setupTests.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── .gitignore
```
