import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorCartPage } from './vendor-cart.page';

const routes: Routes = [
  {
    path: '',
    component: VendorCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorCartPageRoutingModule {}
