import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderListPage } from './leader-list.page';

const routes: Routes = [
  {
    path: '',
    component: LeaderListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderListPageRoutingModule {}
