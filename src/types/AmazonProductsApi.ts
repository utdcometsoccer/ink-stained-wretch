// Types for Amazon Products API response

export interface AmazonProductsApiResponse {
  SearchResult: AmazonSearchResult;
}

export interface AmazonSearchResult {
  Items: AmazonProduct[];
  TotalResultCount: number;
}

export interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  Images?: AmazonImages;
  ItemInfo?: AmazonItemInfo;
  Offers?: AmazonOffers;
}

export interface AmazonImages {
  Primary?: AmazonImageSet;
}

export interface AmazonImageSet {
  Medium?: AmazonImage;
}

export interface AmazonImage {
  URL: string;
  Height: number;
  Width: number;
}

export interface AmazonItemInfo {
  ByLineInfo?: AmazonByLineInfo;
  Title?: AmazonTitle;
}

export interface AmazonByLineInfo {
  Contributors?: AmazonContributor[];
}

export interface AmazonContributor {
  Name: string;
  Role: string;
}

export interface AmazonTitle {
  DisplayValue: string;
}

export interface AmazonOffers {
  Listings?: AmazonListing[];
}

export interface AmazonListing {
  Price?: AmazonPrice;
}

export interface AmazonPrice {
  Amount: number;
  Currency: string;
  DisplayAmount: string;
}
