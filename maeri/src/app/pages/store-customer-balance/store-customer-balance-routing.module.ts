import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { StoreCustomerBalancePage } from './store-customer-balance.page';

const routes: Routes = [
  {
    path: '',
    component: StoreCustomerBalancePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule.forChild()],
  exports: [RouterModule],
})
export class StoreCustomerBalancePageRoutingModule {}
