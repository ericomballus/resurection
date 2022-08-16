import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeRetailerListPage } from './employee-retailer-list.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeRetailerListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRetailerListPageRoutingModule {}
