import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductForGammePage } from './product-for-gamme.page';

const routes: Routes = [
  {
    path: '',
    component: ProductForGammePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductForGammePageRoutingModule {}
