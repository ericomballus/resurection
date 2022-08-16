import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScShopPage } from './sc-shop.page';

const routes: Routes = [
  {
    path: '',
    component: ScShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScShopPageRoutingModule {}
