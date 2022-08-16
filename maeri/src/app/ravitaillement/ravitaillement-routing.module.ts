import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillementPage } from './ravitaillement.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillementPageRoutingModule {}
