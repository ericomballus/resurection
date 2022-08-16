import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScDisplayStockPage } from './sc-display-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ScDisplayStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScDisplayStockPageRoutingModule {}
