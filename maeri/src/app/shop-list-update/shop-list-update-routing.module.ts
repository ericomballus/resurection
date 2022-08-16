import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopListUpdatePage } from './shop-list-update.page';

const routes: Routes = [
  {
    path: '',
    component: ShopListUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopListUpdatePageRoutingModule {}
