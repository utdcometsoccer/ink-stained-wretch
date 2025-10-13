export interface SetDomainInputValueAction {
  type: 'SET_DOMAIN_INPUT_VALUE';
  payload: {
    id?: string;
    authorID?: string;
    topLevelDomain: string;
    secondLevelDomain: string;
  };
}
