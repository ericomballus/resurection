import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillardUpdatePage } from './billard-update.page';

const routes: Routes = [
  {
    path: '',
    component: BillardUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillardUpdatePageRoutingModule {}
