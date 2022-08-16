import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesRetailerSalePage } from './employees-retailer-sale.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeesRetailerSalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRetailerSalePageRoutingModule {}
