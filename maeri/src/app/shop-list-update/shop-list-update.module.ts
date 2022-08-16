import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopListUpdatePageRoutingModule } from './shop-list-update-routing.module';

import { ShopListUpdatePage } from './shop-list-update.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopListUpdatePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ShopListUpdatePage],
})
export class ShopListUpdatePageModule {}
