import { TestBed } from '@angular/core/testing';

import { OpenLibraryService } from './open-library.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {BookDetail, SearchResponse} from "../types/book";

describe('OpenLibraryService', () => {
  let service: OpenLibraryService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenLibraryService]
    });
    service = TestBed.inject(OpenLibraryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should format authors correctly', () => {
    expect(service.formatAuthors([])).toBe('Unknown Author');
    expect(service.formatAuthors(['A'])).toBe('A');
    expect(service.formatAuthors(['A', 'B'])).toBe('A & B');
    expect(service.formatAuthors(['A', 'B', 'C'])).toBe('A & 2 others');
  });

  it('should extract description from string or object', () => {
    expect(service.extractDescription('foo')).toBe('foo');
    expect(service.extractDescription({ value: 'bar' })).toBe('bar');
    expect(service.extractDescription(undefined)).toBe('');
  });

  it('searchBooks() should call correct URL and return data', () => {
    const mockResp: SearchResponse = {
      docs: [{ key: '/works/OL1W', title: 'Test', author_name: [], first_publish_year: 2000 }],
      numFound: 1,
      start: 0
    };

    service.searchBooks('hello', 10, 5).subscribe(res => {
      expect(res).toEqual(mockResp);
    });

    // Match the URL exactly (since searchBooks uses URL query string, not HttpParams)
    const expectedUrl = 'https://openlibrary.org/search.json?q=hello&limit=10&offset=5&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,number_of_pages_median';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  it('getBookDetails() should fetch a work and add author_name via forkJoin', () => {
    const workData: any = {
      key: '/works/OL2W',
      authors: [{ author: { key: '/authors/OL123A' } }]
    };
    const authorName = 'Jane Doe';

    service.getBookDetails('/works/OL2W').subscribe((detail: BookDetail) => {
      expect(detail.author_name).toEqual([authorName]);
      expect(detail.key).toBe(workData.key);
    });

    const workReq = httpMock.expectOne('https://openlibrary.org/works/OL2W.json');
    workReq.flush(workData);

    const authReq = httpMock.expectOne('https://openlibrary.org/authors/OL123A.json');
    authReq.flush({ name: authorName });
  });
});
