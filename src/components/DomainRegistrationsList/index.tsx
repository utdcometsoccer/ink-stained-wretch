import { type MouseEvent, useState } from "react";
import type { FC } from "react";
import type { DomainRegistration } from "../../types/DomainRegistration";
import type { DomainRegistrationsListProps } from "./DomainRegistrationsListProps";
import "./DomainRegistrationsList.css";
export const DomainRegistrationsList: FC<DomainRegistrationsListProps> = ({ domainRegistrationData, localizedText, onClickSelect }) => {
    const [selectedDomainId, setSelectedDomainId] = useState<string | undefined>();

    return (
        <div className="domain-registrations-list">
                <ul>
                    {domainRegistrationData.map((reg: DomainRegistration) => {
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
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        setSelectedDomainId(domainId);
                                        onClickSelect(reg);
                                    }}
                                >
                                    {isSelected ? localizedText.selected : localizedText.select}
                                </button>
                            </li>
                        );
                    })}
                </ul>            
        </div>
    );
}
