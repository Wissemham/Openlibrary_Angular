import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookdetailComponent } from './bookdetail.component';
import {RouterTestingModule} from "@angular/router/testing";
import {OpenLibraryService} from "../services/open-library.service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('BookdetailComponent', () => {
  let component: BookdetailComponent;
  let fixture: ComponentFixture<BookdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // <-- THIS LINE IS ESSENTIAL!
      declarations: [BookdetailComponent],
      providers: [
        { provide: OpenLibraryService, useValue: jasmine.createSpyObj('OpenLibraryService', ['getBookDetails', 'formatAuthors', 'getCoverUrl', 'extractDescription']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BookdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
