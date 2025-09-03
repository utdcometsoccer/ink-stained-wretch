import type { Author } from "./Author";
import type { Culture } from "./Culture";
import type { UserProfile } from "./UserProfile";
import type { Domain } from "./Domain";
import type { ContactInformation } from "./ContactInformation";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";

export interface State {  
  authorError?: string | null;
  Authors?: Author[];
  domainError?: string | null;
  isMenuOpen?: boolean;
  isAuthenticated?: boolean;
  isFirstVisitCulture?: boolean;
  countdown?: number | null;
  showRedirect?: boolean;
  cultureInfo?: CultureInfo;
  error?: string;
  culture?: Culture;
  userProfile?: UserProfile;
  domainRegistration?: {
    domain?: Domain;
    contactInformation?: ContactInformation;
  };
  domainInputValue?: string;
  autoDetect?: boolean;
  authToken?: string | null;
}
