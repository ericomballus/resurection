import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakechangePage } from './makechange.page';

const routes: Routes = [
  {
    path: '',
    component: MakechangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakechangePageRoutingModule {}
