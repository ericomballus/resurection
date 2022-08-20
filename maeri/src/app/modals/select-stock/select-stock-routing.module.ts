import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectStockPage } from './select-stock.page';

const routes: Routes = [
  {
    path: '',
    component: SelectStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectStockPageRoutingModule {}
