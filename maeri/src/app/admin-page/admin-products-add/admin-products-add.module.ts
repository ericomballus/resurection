import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminProductsAddPage } from './admin-products-add.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductsAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminProductsAddPage]
})
export class AdminProductsAddPageModule {}
