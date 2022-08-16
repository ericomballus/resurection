import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreCustomerBalancePageRoutingModule } from './store-customer-balance-routing.module';

import { StoreCustomerBalancePage } from './store-customer-balance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreCustomerBalancePageRoutingModule
  ],
  declarations: [StoreCustomerBalancePage]
})
export class StoreCustomerBalancePageModule {}
