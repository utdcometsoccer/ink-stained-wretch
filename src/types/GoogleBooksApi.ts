// Types for Google Books API response

export interface GoogleBooksApiResponse {
  kind: string;
  totalItems: number;
  items: GoogleBookVolume[];
}

export interface GoogleBookVolume {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: GoogleBookVolumeInfo;
  saleInfo?: GoogleBookSaleInfo;
  accessInfo?: GoogleBookAccessInfo;
  searchInfo?: GoogleBookSearchInfo;
}

export interface GoogleBookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: GoogleBookIndustryIdentifier[];
  readingModes?: GoogleBookReadingModes;
  pageCount?: number;
  printType?: string;
  categories?: string[];
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: GoogleBookPanelizationSummary;
  imageLinks?: GoogleBookImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

export interface GoogleBookIndustryIdentifier {
  type: string;
  identifier: string;
}

export interface GoogleBookReadingModes {
  text: boolean;
  image: boolean;
}

export interface GoogleBookPanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface GoogleBookImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}

export interface GoogleBookSaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: GoogleBookPrice;
  retailPrice?: GoogleBookPrice;
  buyLink?: string;
  offers?: GoogleBookOffer[];
}

export interface GoogleBookPrice {
  amount: number;
  currencyCode: string;
  amountInMicros?: number;
}

export interface GoogleBookOffer {
  finskyOfferType: number;
  listPrice: GoogleBookPrice;
  retailPrice: GoogleBookPrice;
  giftable: boolean;
}

export interface GoogleBookAccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  pdf: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  webReaderLink?: string;
  accessViewStatus?: string;
  quoteSharingAllowed?: boolean;
}

export interface GoogleBookSearchInfo {
  textSnippet: string;
}
