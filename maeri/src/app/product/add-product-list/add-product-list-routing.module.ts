import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductListPage } from './add-product-list.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductListPageRoutingModule {}
