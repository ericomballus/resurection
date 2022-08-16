import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductPackItemModalPage } from './product-pack-item-modal';

const routes: Routes = [
  {
    path: '',
    component: ProductPackItemModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductPackItemModalPage]
})
export class ProductPackItemModalPageModule {}
