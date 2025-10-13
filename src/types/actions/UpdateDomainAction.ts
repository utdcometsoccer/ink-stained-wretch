import type { Domain } from "../Domain";

export interface UpdateDomainAction {
  type: 'UPDATE_DOMAIN';
  payload: Domain;
}
