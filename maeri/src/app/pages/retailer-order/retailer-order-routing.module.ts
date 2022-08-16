import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetailerOrderPage } from './retailer-order.page';

const routes: Routes = [
  {
    path: '',
    component: RetailerOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetailerOrderPageRoutingModule {}
