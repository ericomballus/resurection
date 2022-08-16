import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillDetailsPage } from './bill-details.page';

const routes: Routes = [
  {
    path: '',
    component: BillDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillDetailsPageRoutingModule {}
