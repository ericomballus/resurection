import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorCartPageRoutingModule } from './vendor-cart-routing.module';

import { VendorCartPage } from './vendor-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorCartPageRoutingModule
  ],
  declarations: [VendorCartPage]
})
export class VendorCartPageModule {}
