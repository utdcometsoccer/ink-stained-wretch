// Types for OpenLibrary author works sample
export interface OpenLibraryAuthorWorks {
  links: OpenLibraryAuthorWorksLinks;
  size: number;
  entries: OpenLibraryWorkEntry[];
}

export interface OpenLibraryAuthorWorksLinks {
  self: string;
  author: string;
  prev?: string;
  next?: string;
}

export interface OpenLibraryWorkEntry {
  title?: string;
  covers?: number[];
  key?: string;
  authors?: OpenLibraryWorkAuthor[];
  type?: OpenLibraryKey;
  subjects?: string[];
  description?: string | OpenLibraryTypeValue;
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
  latest_revision?: number;
  revision?: number;
  created?: OpenLibraryValue;
  last_modified?: OpenLibraryValue;
  subtitle?: string;
  first_publish_date?: string;
  excerpts?: OpenLibraryExcerpt[];
  links?: OpenLibraryLink[];
}

export interface OpenLibraryWorkAuthor {
  author: {
    key: string;
  };
  type: {
    key: string;
  };
}

export interface OpenLibraryValue {
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
  bio?: OpenLibraryValue;
  remote_ids?: OpenLibraryRemoteIds;
  photos?: number[];
  alternate_names?: string[];
  links?: OpenLibraryLink[];
  source_records?: string[];
  entity_type?: string;
  birth_date?: string;
  fuller_name?: string;
  title?: string;
  type?: OpenLibraryKey;
  personal_name?: string;
  key?: string;
  latest_revision?: number;
  revision?: number;
  created?: OpenLibraryValue;
  last_modified?: OpenLibraryValue;
}

export interface OpenLibraryTypeValue {
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
  type: OpenLibraryKey;
}

export interface OpenLibraryKey {
  key: string;
}

export interface OpenLibraryExcerpt {
  excerpt: string;
  comment: string;
  author: OpenLibraryKey;
}
