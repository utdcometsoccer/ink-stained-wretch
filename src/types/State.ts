import type { Culture } from "./Culture";
import type { UserProfile } from "./UserProfile";
import type { Domain } from "./Domain";
import type { ContactInformation } from "./ContactInformation";
import type { Author } from "./Author";
import type { Article } from "./Article";
import type { Book } from "./Book";
import type { Social } from "./SocialLink";

export interface State {
  error?: string;
  culture?: Culture;
  userProfile?: UserProfile;
  domainRegistration?: {
    domain?: Domain;
    contactInformation?: ContactInformation;
  };
  authorPageInformation?: {
    author?: Author;
    articles?: Article[];
    books?: Book[];
    socials?: Social[];
  };
  autoDetect?: boolean;
}
