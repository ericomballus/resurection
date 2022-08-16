import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoslivePage } from './poslive.page';

const routes: Routes = [
  {
    path: '',
    component: PoslivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoslivePageRoutingModule {}
