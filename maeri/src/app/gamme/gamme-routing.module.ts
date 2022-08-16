import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GammePage } from './gamme.page';

const routes: Routes = [
  {
    path: '',
    component: GammePage
  },
  {
    path: 'gamme-add',
    loadChildren: () => import('./gamme-add/gamme-add.module').then( m => m.GammeAddPageModule)
  },
  {
    path: 'gamme-update',
    loadChildren: () => import('./gamme-update/gamme-update.module').then( m => m.GammeUpdatePageModule)
  },
  {
    path: 'product-for-gamme',
    loadChildren: () => import('./product-for-gamme/product-for-gamme.module').then( m => m.ProductForGammePageModule)
  },
  {
    path: 'gamme-before-sale',
    loadChildren: () => import('./gamme-before-sale/gamme-before-sale.module').then( m => m.GammeBeforeSalePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GammePageRoutingModule {}
