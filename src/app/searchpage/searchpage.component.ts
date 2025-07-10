import { Component } from '@angular/core';
import {Book, SearchResponse} from "../types/book";
import {OpenLibraryService} from "../services/open-library.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})
export class SearchpageComponent {
  protected readonly Math = Math;
  books: Book[] = [];
  query = '';
  isLoading = false;
  error: string | null = null;
  hasMore = false;
  total = 0;
  offset = 0;
  readonly limit = 20;
  searchSubmitted = false;
  searchControl = new FormControl('');

  constructor(
    protected ol: OpenLibraryService,
    private router: Router
  ) {}

  ngOnInit() {
    // subscribe to keystrokes, debounce so we don't hammer the API
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchSubmitted = true;
      this.offset = 0;
      const q = (query || '').trim();
      if (!q) {
        this.books = [];
        this.total = 0;
        this.hasMore = false;
        return;
      }
      this.onSearch(q);
    });
  }

  onSearch(query: string) {
    this.query = query.trim();
    this.offset = 0;
    this.searchSubmitted = true;
    if (!this.query) {
      this.books = [];
      this.total = 0;
      this.hasMore = false;
      return;
    }
    this.searchBooks();
  }

  searchBooks() {
    this.isLoading = true;
    this.error = null;
    this.ol.searchBooks(this.query, this.limit, this.offset).subscribe({
      next: (res: SearchResponse) => {
        this.books = res.docs;
        this.total = res.numFound;
        this.hasMore = this.books.length < this.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to search books';
        this.isLoading = false;
      }
    });
  }

  onLoadMore() {
    this.isLoading = true;
    this.offset += this.limit;
    this.ol.searchBooks(this.query, this.limit, this.offset).subscribe({
      next: (res: SearchResponse) => {
        this.books = [...this.books, ...res.docs];
        this.hasMore = this.books.length < res.numFound;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load more books';
        this.isLoading = false;
      }
    });
  }

  onBookClick(book: Book) {
    const bookKey = book.key.replace('/works/', '');
    this.router.navigate(['/book', bookKey]);
  }

  retry() {
    if (this.query) {
      this.searchBooks();
    }
  }
}
