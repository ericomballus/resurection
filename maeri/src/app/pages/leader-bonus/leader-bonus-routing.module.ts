import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderBonusPage } from './leader-bonus.page';

const routes: Routes = [
  {
    path: '',
    component: LeaderBonusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderBonusPageRoutingModule {}
