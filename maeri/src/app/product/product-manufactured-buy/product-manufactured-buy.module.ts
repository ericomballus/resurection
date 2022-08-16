import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ProductManufacturedBuyPage } from "./product-manufactured-buy.page";
import { ShareModule } from "src/app/share.module";

const routes: Routes = [
  {
    path: "",
    component: ProductManufacturedBuyPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ShareModule,
  ],
  declarations: [ProductManufacturedBuyPage],
})
export class ProductManufacturedBuyPageModule {}
