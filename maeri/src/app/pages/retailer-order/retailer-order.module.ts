import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetailerOrderPageRoutingModule } from './retailer-order-routing.module';

import { RetailerOrderPage } from './retailer-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetailerOrderPageRoutingModule
  ],
  declarations: [RetailerOrderPage]
})
export class RetailerOrderPageModule {}
