import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, of, switchMap, throwError} from "rxjs";
import {BookDetail, SearchResponse} from "../types/book";

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryService {
  private  readonly BASE_URL = 'https://openlibrary.org';
  private  readonly COVERS_URL = 'https://covers.openlibrary.org/b';
  constructor(private http: HttpClient) {}

  searchBooks(
    query: string,
    limit = 20,
    offset = 0
  ): Observable<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${this.BASE_URL}/search.json?q=${encodedQuery}&limit=${limit}&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,number_of_pages_median`;

    return this.http.get<SearchResponse>(url).pipe(
      catchError((err) => {
        console.error('Search failed', err);
        throw err;
      })
    );
  }

  getBookDetails(bookKey: string): Observable<BookDetail> {
    const cleanKey = bookKey.replace('/works/', '');
    const url = `${this.BASE_URL}/works/${cleanKey}.json`;

    return this.http.get<BookDetail>(url).pipe(
      switchMap((data: any) => {
        if (data.authors && Array.isArray(data.authors)) {
          const authorRequests = data.authors.map((authorRef: any) => {
            const authorKey = authorRef?.author?.key;
            return authorKey
              ? this.http.get<{ name: string }>(`${this.BASE_URL}${authorKey}.json`)
                .pipe(map(res => res.name), catchError(() => of('Unknown Author')))
              : of('Unknown Author');
          });

          return forkJoin(authorRequests).pipe(
            map(authorNames => {
              data.author_name = authorNames;
              return data as BookDetail;
            })
          );
        }

        return of(data as BookDetail);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to fetch book details:', error);
        return throwError(() => new Error('Book details request failed'));
      })
    );
  }

  getCoverUrl(
    coverId: number | undefined,
    size: 'S' | 'M' | 'L' = 'M'
  ): string | null {
    if (!coverId) return null;
    return `${this.COVERS_URL}/id/${coverId}-${size}.jpg`;
  }

  formatAuthors(authors?: string[]): string {
    if (!authors || authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} & ${authors.length - 1} others`;
  }


  extractDescription(
    description?: string | { value: string }
  ): string {
    if (!description) return '';
    return typeof description === 'string'
      ? description
      : description.value ?? '';
  }
}

