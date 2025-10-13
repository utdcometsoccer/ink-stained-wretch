export type { SetUIStateAction } from './SetUIStateAction';
export type { SetErrorAction } from './SetErrorAction';
export type { ClearErrorAction } from './ClearErrorAction';
export type { UpdateStateAction } from './UpdateStateAction';
export type { UpdateDomainAction } from './UpdateDomainAction';
export type { UpdateDomainContactInfoAction } from './UpdateDomainContactInfoAction';
export type { SaveAuthorAction } from './SaveAuthorAction';
export type { DeleteAuthorAction } from './DeleteAuthorAction';
export type { UpdateUseCookiesAction } from './UpdateUseCookiesAction';
export type { SetDomainInputValueAction } from './SetDomainInputValueAction';
export type { SelectDomainRegistrationAction } from './SelectDomainRegistrationAction';
export type { SetDomainRegistrationsAction } from './SetDomainRegistrationsAction';

import type { SetUIStateAction } from './SetUIStateAction';
import type { SetErrorAction } from './SetErrorAction';
import type { ClearErrorAction } from './ClearErrorAction';
import type { UpdateStateAction } from './UpdateStateAction';
import type { UpdateDomainAction } from './UpdateDomainAction';
import type { UpdateDomainContactInfoAction } from './UpdateDomainContactInfoAction';
import type { SaveAuthorAction } from './SaveAuthorAction';
import type { DeleteAuthorAction } from './DeleteAuthorAction';
import type { UpdateUseCookiesAction } from './UpdateUseCookiesAction';
import type { SetDomainInputValueAction } from './SetDomainInputValueAction';
import type { SelectDomainRegistrationAction } from './SelectDomainRegistrationAction';
import type { SetDomainRegistrationsAction } from './SetDomainRegistrationsAction';

export type AppAction =
  | SetUIStateAction
  | SetErrorAction
  | ClearErrorAction
  | UpdateStateAction
  | UpdateDomainAction
  | UpdateDomainContactInfoAction
  | SaveAuthorAction
  | DeleteAuthorAction
  | UpdateUseCookiesAction
  | SetDomainInputValueAction
  | SelectDomainRegistrationAction
  | SetDomainRegistrationsAction;
