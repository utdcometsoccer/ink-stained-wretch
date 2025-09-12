// Types generated from PenguinRandomHouseListAuthorTitles.json
export interface PenguinRandomHouseListAuthorTitles {
  status: string;
  recordCount: number;
  startTimestamp: string;
  endTimestamp: string;
  timeTaken: number;
  data: PenguinRandomHouseTitlesData;
  error: string | null;
  params: PenguinRandomHouseTitlesParams;
  requestedMethod: string;
}

export interface PenguinRandomHouseTitlesData {
  titles: PenguinRandomHouseTitle[];
  _embeds: any | null;
  _links: PenguinRandomHouseLink[];
}

export interface PenguinRandomHouseTitle {
  isbn: number;
  isbnHyphenated: string;
  title: string;
  subtitle: string | null;
  author: string;
  onsale: string;
  price: PenguinRandomHousePrice[];
  seoFriendlyUrl: string;
  format: PenguinRandomHouseCodeDesc;
  subformat: PenguinRandomHouseCodeDesc;
  division: PenguinRandomHouseCodeDesc;
  imprint: PenguinRandomHouseCodeDesc;
  publisher: PenguinRandomHouseCodeDesc;
  pages: number;
  age: PenguinRandomHouseCodeDesc;
  grade: PenguinRandomHouseCodeDesc;
  educationGrade: PenguinRandomHouseCodeDesc;
  sgmt_desc: string | null;
  subjects: PenguinRandomHouseCodeDesc[];
  trim: string;
  formatFamily: string;
  consumerFormat: string;
  consumerImprint: string | null;
  consumerImprintUri: string | null;
  saleStatus: string;
  language: string;
  seriesNumber: string | null;
  subseries: string | null;
  editionType: string | null;
  propertyName: string | null;
  cartonQuantity: number;
  version: string;
  productLine: string;
  productType: string;
  flags: string[];
  workId: number;
  frontlistiestSeq: string | null;
  contribRoleCode: string | null;
  contribRoleDesc: string | null;
  salesRestriction: PenguinRandomHouseCodeDesc;
  titleBlock: string | null;
  titleShort: string;
  audioPackage: string | null;
  projectedMinutes: number | null;
  binding: PenguinRandomHouseCodeDesc;
  editionId: number;
  editionTarget: PenguinRandomHouseCodeDesc;
  originalIsbn: string | null;
  illustPhoto: string | null;
  childrensBookCategory: string | null;
  asin: string;
  customSubjectCategory: string | null;
  coverUpdatedOn: string;
  otherFields: Record<string, any>;
  isbn10: string;
  isbn10hyphenated: string | null;
  boxComponentCt: number;
  focDate: string | null;
  cataDate: string | null;
  itemTypeCode: string | null;
  rcatDate: string | null;
  reisFocDate: string | null;
  reisCataDate: string | null;
  orderReq: number;
  overUpc: string | null;
  additionalSeriesInfo: string | null;
  mediaRating: string | null;
  mediaRatingDesc: string | null;
  coverVariantDesc: string | null;
  catalogs: any[];
  familyCoverVariantFlag: boolean;
  sortByAuthor: string;
  alerts: any[];
  cbRtnDate: string | null;
  isbnCounts: PenguinRandomHouseIsbnCounts;
  graphicCategory: string | null;
  shortRunInd: string | null;
  asset_types: Record<string, any>;
  isbnStr: string;
  _embeds: any | null;
  _links: PenguinRandomHouseLink[];
}

export interface PenguinRandomHousePrice {
  amount: number;
  currencyCode: string;
  pricingType: string | null;
}

export interface PenguinRandomHouseCodeDesc {
  code: string | null;
  description: string | null;
}

export interface PenguinRandomHouseIsbnCounts {
  variant: number;
  format: number;
}

export interface PenguinRandomHouseLink {
  rel: string;
  href: string;
  method: string;
  parameters: any | null;
}

export interface PenguinRandomHouseTitlesParams {
  authorId: string;
  clientGroup: string;
  domain: string;
}
// Auto-generated from PenguinRandomHouseSearchResult.json

export interface PenguinRandomHouseSearchResult {
  status: string;
  recordCount: number;
  startTimestamp: string;
  endTimestamp: string;
  timeTaken: number;
  data: PenguinRandomHouseData;
}

export interface PenguinRandomHouseData {
  results: PenguinRandomHouseResult[];
}

export type PenguinRandomHouseResult = AuthorResult | WorkResult;

export interface AuthorResult {
  docType: "author";
  id: string;
  key: string;
  name: string;
  score: number;
  url: string;
  domain: string[];
  title: string | null;
  description: string | null;
  author: null;
  authorFirst: string | null;
  authorLast: string | null;
  photoCredit: string | null;
  onTour: boolean | null;
  seriesAuthor: string | null;
  seriesIsbn: string | null;
  seriesCount: number | null;
  keywordId: string | null;
  _embeds: null;
  _links: PenguinRandomHouseLink[];
}

export interface WorkResult {
  docType: "work";
  id: string;
  key: string;
  name: string;
  score: number;
  url: string;
  domain: string[];
  title: string | null;
  description: string[];
  author: string[];
  authorFirst: string | null;
  authorLast: string | null;
  photoCredit: string | null;
  onTour: boolean | null;
  seriesAuthor: string | null;
  seriesIsbn: string | null;
  seriesCount: number | null;
  keywordId: string | null;
  _embeds: null;
  _links: PenguinRandomHouseLink[];
}

export interface PenguinRandomHouseLink {
  rel: string;
  href: string;
  method: string;
  parameters: any;
}
