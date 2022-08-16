import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeRetailerProductAddPage } from './employee-retailer-product-add.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeRetailerProductAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRetailerProductAddPageRoutingModule {}
