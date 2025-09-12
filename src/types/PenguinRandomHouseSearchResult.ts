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
