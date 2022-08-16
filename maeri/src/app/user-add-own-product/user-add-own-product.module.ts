import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAddOwnProductPageRoutingModule } from './user-add-own-product-routing.module';

import { UserAddOwnProductPage } from './user-add-own-product.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAddOwnProductPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [UserAddOwnProductPage],
})
export class UserAddOwnProductPageModule {}
