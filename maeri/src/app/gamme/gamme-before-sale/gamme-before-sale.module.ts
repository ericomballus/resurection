import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GammeBeforeSalePageRoutingModule } from './gamme-before-sale-routing.module';

import { GammeBeforeSalePage } from './gamme-before-sale.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GammeBeforeSalePageRoutingModule
  ],
  declarations: [GammeBeforeSalePage]
})
export class GammeBeforeSalePageModule {}
