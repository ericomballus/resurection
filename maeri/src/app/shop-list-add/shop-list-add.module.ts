import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopListAddPageRoutingModule } from './shop-list-add-routing.module';

import { ShopListAddPage } from './shop-list-add.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopListAddPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ShopListAddPage],
})
export class ShopListAddPageModule {}
