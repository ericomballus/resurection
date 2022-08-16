import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductPackItemDetailsPage } from './product-pack-item-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPackItemDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductPackItemDetailsPage]
})
export class ProductPackItemDetailsPageModule {}
