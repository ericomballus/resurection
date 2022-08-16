import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorRetailerProductsPage } from './vendor-retailer-products.page';

const routes: Routes = [
  {
    path: '',
    component: VendorRetailerProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRetailerProductsPageRoutingModule {}
