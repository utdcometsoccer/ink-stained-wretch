# Strongly Typed Actions

This directory contains strongly typed action definitions for the application reducer.

## Overview

Each action type has been given its own strongly typed interface, replacing the generic `payload?: any` with specific payload types based on how the action is used in the reducer.

## Action Types

### SetUIStateAction
**Type:** `SET_UI_STATE`  
**Payload:** `UIStates | { uiState: UIStates; autoDetect?: boolean }`  
**Purpose:** Sets the current UI state of the application. Can optionally set autoDetect flag.

### SetErrorAction
**Type:** `SET_ERROR`  
**Payload:** `string`  
**Purpose:** Sets an error message and switches to error UI state.

### ClearErrorAction
**Type:** `CLEAR_ERROR`  
**Payload:** None  
**Purpose:** Clears any existing error message.

### UpdateStateAction
**Type:** `UPDATE_STATE`  
**Payload:** `Partial<State>`  
**Purpose:** Updates any properties in the application state using a partial merge.

### UpdateDomainAction
**Type:** `UPDATE_DOMAIN`  
**Payload:** `Domain`  
**Purpose:** Updates the domain information in the current domain registration.

### UpdateDomainContactInfoAction
**Type:** `UPDATE_DOMAIN_CONTACT_INFO`  
**Payload:** `ContactInformation`  
**Purpose:** Updates the contact information in the current domain registration.

### SaveAuthorAction
**Type:** `SAVE_AUTHOR`  
**Payload:** `Author`  
**Purpose:** Saves or updates an author in the Authors list.

### DeleteAuthorAction
**Type:** `DELETE_AUTHOR`  
**Payload:** `string` (author id)  
**Purpose:** Removes an author from the Authors list by ID.

### UpdateUseCookiesAction
**Type:** `UPDATE_USE_COOKIES`  
**Payload:** `boolean`  
**Purpose:** Updates the user's cookie preference.

### SetDomainInputValueAction
**Type:** `SET_DOMAIN_INPUT_VALUE`  
**Payload:** `{ id?: string; authorID?: string; topLevelDomain: string; secondLevelDomain: string }`  
**Purpose:** Sets the domain input values including top-level and second-level domain.

### SelectDomainRegistrationAction
**Type:** `SELECT_DOMAIN_REGISTRATION`  
**Payload:** `DomainRegistration`  
**Purpose:** Selects a domain registration from available options.

### SetDomainRegistrationsAction
**Type:** `SET_DOMAIN_REGISTRATIONS`  
**Payload:** `DomainRegistration[]`  
**Purpose:** Sets the list of available domain registrations.

## Usage

Import specific action types:
```typescript
import type { SetErrorAction, UpdateStateAction } from '../types/actions';

const errorAction: SetErrorAction = {
  type: 'SET_ERROR',
  payload: 'Something went wrong'
};

const stateAction: UpdateStateAction = {
  type: 'UPDATE_STATE',
  payload: { isAuthenticated: true }
};
```

Or use the union type `AppAction`:
```typescript
import type { AppAction } from '../types/actions';

const action: AppAction = { type: 'CLEAR_ERROR' };
```

## Benefits

1. **Type Safety:** TypeScript will catch errors at compile time if you try to pass the wrong payload type
2. **IntelliSense:** IDEs can provide better autocomplete suggestions for action payloads
3. **Documentation:** Action interfaces serve as documentation for what data each action expects
4. **Refactoring:** Changing action payload structures will cause compile errors, making refactoring safer
