import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GammeAddPage } from './gamme-add.page';

const routes: Routes = [
  {
    path: '',
    component: GammeAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GammeAddPageRoutingModule {}
