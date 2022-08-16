import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplaySalePageRoutingModule } from './display-sale-routing.module';

import { DisplaySalePage } from './display-sale.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplaySalePageRoutingModule
  ],
  declarations: [DisplaySalePage]
})
export class DisplaySalePageModule {}
