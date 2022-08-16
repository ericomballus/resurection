import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeRetailerInvoicesPage } from './employee-retailer-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeRetailerInvoicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRetailerInvoicesPageRoutingModule {}
