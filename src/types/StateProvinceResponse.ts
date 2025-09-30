export interface StateProvinceDetail {
    code: string;
    name: string;
    country: string;
    culture: string;
}
export interface StateProvinceCountry {
    country: string;
    culture: string;
    stateProvinces: StateProvinceDetail[];
}
export interface StateProvinceResponse {
    data: StateProvinceCountry[];
}