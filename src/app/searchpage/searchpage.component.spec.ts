import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { SearchpageComponent } from './searchpage.component';
import {OpenLibraryService} from "../services/open-library.service";
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";
import {SearchResponse} from "../types/book";
import {of, throwError} from "rxjs";
import {By} from "@angular/platform-browser";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('SearchpageComponent', () => {
  let component: SearchpageComponent;
  let fixture: ComponentFixture<SearchpageComponent>;
  let olService: jasmine.SpyObj<OpenLibraryService>;
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('OpenLibraryService', ['searchBooks', 'getCoverUrl', 'formatAuthors']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SearchpageComponent],
      providers: [{ provide: OpenLibraryService, useValue: spy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow <lucide-icon> etc.
    }).compileComponents();

    olService = TestBed.inject(OpenLibraryService) as jasmine.SpyObj<OpenLibraryService>;
    fixture = TestBed.createComponent(SearchpageComponent);
    component = fixture.componentInstance;
    olService.formatAuthors.and.returnValue('Author X');
  });

  it('should perform a live search after debounce and populate books', fakeAsync(() => {
    const mockResp: SearchResponse = {
      docs: [{ key: '/works/OL1W', title: 'Test Title', author_name: ['X'], first_publish_year: 2020 }],
      numFound: 1,
      start: 0
    };
    olService.searchBooks.and.returnValue(of(mockResp));

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    tick(300); // wait for debounce
    fixture.detectChanges();

    expect(olService.searchBooks).toHaveBeenCalledWith('abc', component.limit, 0);
    expect(component.books.length).toBe(1);
    expect(component.total).toBe(1);

    // Check that the book title is rendered
    const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleEl.textContent).toContain('Test Title');
  }));

  it('should show error message on search failure', fakeAsync(() => {
    olService.searchBooks.and.returnValue(throwError(() => new Error('Network error')));

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'fail';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    expect(component.error).toBe('Network error');
    const errEl = fixture.debugElement.query(By.css('.border-red-400')).nativeElement;
    expect(errEl.textContent).toContain('Network error');
  }));
});

