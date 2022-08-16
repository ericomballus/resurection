import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddStoreCustomerPage } from './add-store-customer.page';

const routes: Routes = [
  {
    path: '',
    component: AddStoreCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStoreCustomerPageRoutingModule {}
