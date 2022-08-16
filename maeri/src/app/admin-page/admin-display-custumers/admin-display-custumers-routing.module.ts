import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDisplayCustumersPage } from './admin-display-custumers.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDisplayCustumersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDisplayCustumersPageRoutingModule {}
