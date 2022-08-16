import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ShopPage } from './shop.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from '../share.module';
const routes: Routes = [
  {
    path: '',
    component: ShopPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [ShopPage],
})
export class ShopPageModule {}
