import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreCustomerPage } from './store-customer.page';

const routes: Routes = [
  {
    path: '',
    component: StoreCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreCustomerPageRoutingModule {}
