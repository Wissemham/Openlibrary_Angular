import {Component, OnInit} from '@angular/core';
import {BookDetail} from "../types/book";
import {ActivatedRoute, Router} from "@angular/router";
import {OpenLibraryService} from "../services/open-library.service";

@Component({
  selector: 'app-bookdetail',
  templateUrl: './bookdetail.component.html',
  styleUrls: ['./bookdetail.component.css']
})
export class BookdetailComponent implements  OnInit{
  bookDetail: BookDetail | null = null;
  isLoading = true;
  error: string | null = null;
  bookKey = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public ol: OpenLibraryService
  ) {}

  ngOnInit() {
    this.bookKey = this.route.snapshot.paramMap.get('bookKey')!;
    this.fetchBookDetail();
  }

  fetchBookDetail() {
    if (!this.bookKey) {
      this.error = 'No book specified';
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.ol.getBookDetails(this.bookKey).subscribe({
      next: (detail) => {
        this.bookDetail = detail;
        console.log("bookdetaild",this.bookDetail)
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load book details';
        this.isLoading = false;
      }
    });
  }

  handleBack() {
    this.router.navigate(['/']);
  }
}

