import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { Author } from "./Author";
import type { DomainRegistration } from "./DomainRegistration";
import type { SubscriptionPlan } from "./SubscriptionPlan";
import type { UserProfile } from "./UserProfile";

export interface State {  
  Authors?: Author[];
  isAuthenticated?: boolean;  
  cultureInfo?: CultureInfo;
  error?: Error | string;
  userProfile?: UserProfile;
  domainRegistration?: DomainRegistration;
  domainRegistrations?: DomainRegistration[];
  autoDetect?: boolean;
  authToken?: string | null;
  subscriptionPlans?: SubscriptionPlan[];
  selectedSubscriptionPlan?: SubscriptionPlan;
  useCookies?: boolean;
}
