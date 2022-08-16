import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminProductsMadePage } from './admin-products-made.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductsMadePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminProductsMadePage]
})
export class AdminProductsMadePageModule {}
