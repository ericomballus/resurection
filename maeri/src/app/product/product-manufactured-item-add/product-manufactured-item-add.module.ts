import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductManufacturedItemAddPage } from './product-manufactured-item-add.page';

const routes: Routes = [
  {
    path: '',
    component: ProductManufacturedItemAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductManufacturedItemAddPage]
})
export class ProductManufacturedItemAddPageModule {}
