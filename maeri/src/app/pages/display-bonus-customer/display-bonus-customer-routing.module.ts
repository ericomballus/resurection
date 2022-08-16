import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayBonusCustomerPage } from './display-bonus-customer.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayBonusCustomerPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayBonusCustomerPageRoutingModule {}
