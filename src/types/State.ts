import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { Author } from "./Author";
import type { DomainRegistration } from "./DomainRegistration";
import type { LocalizedText } from "./LocalizedText";
import type { StripeCustomer } from "./Stripe";
import type { SubscriptionPlan } from "./SubscriptionPlan";
import type { UserProfile } from "./UserProfile";

export interface State {
  Authors?: Author[];
  authToken?: string | null;
  autoDetect?: boolean;
  cultureInfo?: CultureInfo;
  domainRegistration?: DomainRegistration;
  domainRegistrations?: DomainRegistration[];
  error?: Error | string;
  isAuthenticated?: boolean;
  loading?: boolean;
  localizationData?: LocalizedText;
  localizationDataLoaded?: boolean;
  selectedSubscriptionPlan?: SubscriptionPlan;
  SubscriptionId?: string;
  customer?: StripeCustomer;
  subscriptionPlans?: SubscriptionPlan[];
  useCookies?: boolean;
  userProfile?: UserProfile;
}
