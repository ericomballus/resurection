import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseVoucherPage } from './purchase-voucher.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseVoucherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseVoucherPageRoutingModule {}
