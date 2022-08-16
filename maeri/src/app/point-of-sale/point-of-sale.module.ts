import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { PointOfSalePage } from "./point-of-sale.page";
import { TranslateModule } from "@ngx-translate/core";
import { ShareModule } from "../share.module";
import { IonicImageLoader } from "ionic-image-loader";

const routes: Routes = [
  {
    path: "",
    component: PointOfSalePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ShareModule,
    IonicImageLoader
  ],
  declarations: [PointOfSalePage]
})
export class PointOfSalePageModule {}
