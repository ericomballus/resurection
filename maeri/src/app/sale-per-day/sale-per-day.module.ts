import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { SalePerDayPage } from "./sale-per-day.page";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
const routes: Routes = [
  {
    path: "",
    component: SalePerDayPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
  declarations: [SalePerDayPage],
})
export class SalePerDayPageModule {}
