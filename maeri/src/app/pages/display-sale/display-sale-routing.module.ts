import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplaySalePage } from './display-sale.page';

const routes: Routes = [
  {
    path: '',
    component: DisplaySalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplaySalePageRoutingModule {}
