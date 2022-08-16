import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { InvoiceUnpaidPage } from "./invoice-unpaid.page";

const routes: Routes = [
  {
    path: "",
    component: InvoiceUnpaidPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  declarations: [InvoiceUnpaidPage],
})
export class InvoiceUnpaidPageModule {}
