import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductListPageRoutingModule } from './add-product-list-routing.module';

import { AddProductListPage } from './add-product-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProductListPageRoutingModule
  ],
  declarations: [AddProductListPage]
})
export class AddProductListPageModule {}
