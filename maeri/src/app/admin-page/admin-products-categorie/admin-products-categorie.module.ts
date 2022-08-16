import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminProductsCategoriePage } from './admin-products-categorie.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductsCategoriePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminProductsCategoriePage]
})
export class AdminProductsCategoriePageModule {}
