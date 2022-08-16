import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorRetailerListPage } from './vendor-retailer-list.page';

const routes: Routes = [
  {
    path: '',
    component: VendorRetailerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRetailerListPageRoutingModule {}
