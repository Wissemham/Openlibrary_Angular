import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SearchpageComponent} from "./searchpage/searchpage.component";
import {BookdetailComponent} from "./bookdetail/bookdetail.component";

const routes: Routes = [
  { path: '', component: SearchpageComponent },
  { path: 'book/:bookKey', component: BookdetailComponent },
  { path: '**', redirectTo: '' }         // 404 → Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
