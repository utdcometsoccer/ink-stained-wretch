export type ContactInfoErrors = {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emailAddress?: string;
    telephoneNumber?: string;
};

export type DomainRegistrationState = {
    domainInputValue: string;
    domainError: string | null;
    APICallFailed: boolean;
    contactInfoErrors: ContactInfoErrors;
};
