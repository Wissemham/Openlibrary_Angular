import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { SearchpageComponent } from './searchpage/searchpage.component';
import { BookdetailComponent } from './bookdetail/bookdetail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  AlertCircle,
  ArrowLeft,
  Book,
  BookOpen, Calendar, Clock,
  LucideAngularModule,
  RefreshCw,
  Search,
  Sparkles,
  User
} from "lucide-angular";

@NgModule({
  declarations: [
    AppComponent,
    SearchpageComponent,
    BookdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({ Sparkles, BookOpen,Search,ArrowLeft,
      Book,AlertCircle,RefreshCw,User,Calendar,Clock })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
