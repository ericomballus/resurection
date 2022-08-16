import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VendorRetailerProductsPageRoutingModule } from "./vendor-retailer-products-routing.module";

import { VendorRetailerProductsPage } from "./vendor-retailer-products.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorRetailerProductsPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [VendorRetailerProductsPage],
})
export class VendorRetailerProductsPageModule {}
