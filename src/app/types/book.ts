export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  number_of_pages_median?: number;
}

export interface BookDetail extends Book {
  description?: string | { value: string };
  subjects?: string[];
  isbn_10?: string[];
  isbn_13?: string[];
  publishers?: string[];
  publish_date?: string[];
  first_publish_date?: string;
  subtitle?: string;
  first_publish_year?: number;
  author_name?: string[];
  covers?: number[];
  created?: {
    type: string;
    value: string;
  };
}

export interface SearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
  numFoundExact?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
