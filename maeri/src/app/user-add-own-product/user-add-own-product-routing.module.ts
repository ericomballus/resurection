import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAddOwnProductPage } from './user-add-own-product.page';

const routes: Routes = [
  {
    path: '',
    component: UserAddOwnProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAddOwnProductPageRoutingModule {}
