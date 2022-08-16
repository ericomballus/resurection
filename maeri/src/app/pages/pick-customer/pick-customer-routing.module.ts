import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickCustomerPage } from './pick-customer.page';

const routes: Routes = [
  {
    path: '',
    component: PickCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickCustomerPageRoutingModule {}
