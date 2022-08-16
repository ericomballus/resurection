import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScShopPageRoutingModule } from './sc-shop-routing.module';

import { ScShopPage } from './sc-shop.page';
import { ShareModule } from 'src/app/share.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScShopPageRoutingModule,
    ShareModule,
    TranslateModule.forChild(),
  ],
  declarations: [ScShopPage],
})
export class ScShopPageModule {}
