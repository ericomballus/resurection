import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickEmployeeRetailerPage } from './pick-employee-retailer.page';

const routes: Routes = [
  {
    path: '',
    component: PickEmployeeRetailerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickEmployeeRetailerPageRoutingModule {}
