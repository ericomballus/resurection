import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerRefuelingPage } from './manager-refueling.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerRefuelingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRefuelingPageRoutingModule {}
