import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreCustomerInvoicePage } from './store-customer-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: StoreCustomerInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreCustomerInvoicePageRoutingModule {}
