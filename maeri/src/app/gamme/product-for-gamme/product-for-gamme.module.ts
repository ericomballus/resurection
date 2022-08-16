import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductForGammePageRoutingModule } from './product-for-gamme-routing.module';

import { ProductForGammePage } from './product-for-gamme.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductForGammePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ProductForGammePage],
})
export class ProductForGammePageModule {}
