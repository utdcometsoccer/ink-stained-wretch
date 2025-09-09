import type { Author } from "./Author";
import type { ContactInformation } from "./ContactInformation";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { Domain } from "./Domain";
import type { SubscriptionPlan } from "./SubscriptionPlan";
import type { UserProfile } from "./UserProfile";

export interface State {  
  Authors?: Author[];
  isAuthenticated?: boolean;  
  cultureInfo?: CultureInfo;
  error?: Error | string;
  userProfile?: UserProfile;
  domainRegistration?: {
    domain?: Domain;
    contactInformation?: ContactInformation;
  };
  autoDetect?: boolean;
  authToken?: string | null;
  subscriptionPlans?: SubscriptionPlan[];
  selectedSubscriptionPlan?: SubscriptionPlan;
  useCookies?: boolean;
}
