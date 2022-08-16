import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerDisplayBillPage } from './manager-display-bill.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerDisplayBillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerDisplayBillPageRoutingModule {}
