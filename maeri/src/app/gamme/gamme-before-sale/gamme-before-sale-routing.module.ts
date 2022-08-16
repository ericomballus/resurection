import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GammeBeforeSalePage } from './gamme-before-sale.page';

const routes: Routes = [
  {
    path: '',
    component: GammeBeforeSalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GammeBeforeSalePageRoutingModule {}
