import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserContratPage } from './user-contrat.page';

const routes: Routes = [
  {
    path: '',
    component: UserContratPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserContratPageRoutingModule {}
