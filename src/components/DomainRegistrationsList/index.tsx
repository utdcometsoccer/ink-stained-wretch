import { useEffect } from "react";
import type { FC } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import "../AppDomainRegistrationsList.css";
import { useDomainRegistrations } from "../../hooks/useDomainRegistrations";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import type { DomainRegistration } from "../../types/DomainRegistration";
import type { DomainRegistrationsListProps } from "./DomainRegistrationsListProps";
export const DomainRegistrationsList: FC<DomainRegistrationsListProps> = ({ accessToken, state, dispatch, culture, domainRegistrationsFetcher = useDomainRegistrations, onError }) => {
    const { data, error, loading } = domainRegistrationsFetcher(accessToken);
    const localized = useGetLocalizedText(culture ?? state.cultureInfo?.Culture ?? "en-us")?.DomainRegistrationsList || {
        title: "Domain Registrations",
        error: "Error loading domain registrations.",
        loading: "Loading...",
        empty: "No domain registrations found.",
        select: "Select",
        selected: "Selected"
    };
    useTrackComponent("DomainRegistrationsList", { state, dispatch, culture });

    // Track selected domain registration
    const selectedDomainId = state?.domainRegistration?.domain?.id;

    useEffect(() => {
        if (data) {
            dispatch({ type: "SET_DOMAIN_REGISTRATIONS", payload: data });
        }
    }, [data, dispatch]);
    useEffect(() => {
        if (error && onError) {
            onError(error);
        }
    }, [error, onError]);
    return (
        <div className="domain-registrations-list">
            <h2>{localized?.title}</h2>
            {loading && <CircularProgress />}
            {error && <div className="error">{localized.error}: {String(error)}</div>}
            {!loading && !error && (!data || data.length === 0) && <div>{localized.empty}</div>}
            {!loading && !error && data && data.length > 0 && (
                <ul>
                    {data.map((reg: DomainRegistration) => {
                        const domainId = reg.domain?.id || `${reg.domain?.secondLevelDomain}.${reg.domain?.topLevelDomain}`;
                        const isSelected = selectedDomainId === domainId;
                        return (
                            <li
                                key={domainId}
                                className={`domain-registration-item${isSelected ? " selected" : ""}`}
                            >
                                <span>{reg.domain?.secondLevelDomain}.{reg.domain?.topLevelDomain}</span>
                                <button
                                    className="select-domain-btn"
                                    disabled={isSelected}
                                    onClick={() => dispatch({ type: "SELECT_DOMAIN_REGISTRATION", payload: reg })}
                                >
                                    {isSelected ? localized.selected : localized.select}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
