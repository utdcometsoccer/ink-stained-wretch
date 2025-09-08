// Types for OpenLibrary author works sample
export interface OpenLibraryAuthorWorks {
  links: OpenLibraryAuthorWorksLinks;
  size: number;
  entries: OpenLibraryWorkEntry[];
}

export interface OpenLibraryAuthorWorksLinks {
  self: string;
  author: string;
  next?: string;
}

export interface OpenLibraryWorkEntry {
  type?: OpenLibraryType;
  title?: string;
  authors?: OpenLibraryWorkAuthor[];
  key?: string;
  latest_revision?: number;
  revision?: number;
  created?: OpenLibraryDateTimeOnly;
  last_modified?: OpenLibraryDateTimeOnly;
  covers?: number[];
  description?: string | OpenLibraryDescription;
  subtitle?: string;
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  first_publish_date?: string;
  excerpts?: any[];
  links?: any[];
}

export interface OpenLibraryWorkAuthor {
  // Structure is not detailed in sample, so left as empty
}

export interface OpenLibraryDateTimeOnly {
  value: string;
}

export interface OpenLibraryDescription {
  value: string;
}
// Types for OpenLibrary author search result
export interface OpenLibraryAuthorSearchResult {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: AuthorDoc[];
}

export interface AuthorDoc {
  key: string;
  text: string[];
  type: string;
  name: string;
  alternate_names: string[];
  birth_date: string;
  top_work: string;
  work_count: number;
  top_subjects: string[];
  _version_: number;
}

// Types for OpenLibrary single author sample
export interface OpenLibrarySingleAuthor {
  name: string;
  bio?: OpenLibraryBio;
  remote_ids?: OpenLibraryRemoteIds;
  photos?: number[];
  alternate_names?: string[];
  links?: OpenLibraryLink[];
  source_records?: string[];
  entity_type?: string;
  birth_date?: string;
  fuller_name?: string;
  title?: string;
  type?: OpenLibraryType;
  personal_name?: string;
  key?: string;
  latest_revision?: number;
  revision?: number;
  created?: OpenLibraryDateTime;
  last_modified?: OpenLibraryDateTime;
}

export interface OpenLibraryBio {
  type: string;
  value: string;
}

export interface OpenLibraryRemoteIds {
  viaf?: string;
  goodreads?: string;
  storygraph?: string;
  isni?: string;
  librarything?: string;
  amazon?: string;
  wikidata?: string;
  imdb?: string;
  musicbrainz?: string;
  lc_naf?: string;
  opac_sbn?: string;
}

export interface OpenLibraryLink {
  title: string;
  url: string;
  type: OpenLibraryType;
}

export interface OpenLibraryType {
  key: string;
}

export interface OpenLibraryDateTime {
  type: string;
  value: string;
}
