import type { Author } from "./Author";
import type { ContactInformation } from "./ContactInformation";
import type { Culture } from "./Culture";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { Domain } from "./Domain";
import type { SubscriptionPlan } from "./SubscriptionPlan";
import type { UserProfile } from "./UserProfile";

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
  subscriptionPlans?: SubscriptionPlan[];
  selectedSubscriptionPlan?: SubscriptionPlan;
}
