import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayStoreCustomerPageRoutingModule } from './display-store-customer-routing.module';

import { DisplayStoreCustomerPage } from './display-store-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayStoreCustomerPageRoutingModule
  ],
  declarations: [DisplayStoreCustomerPage]
})
export class DisplayStoreCustomerPageModule {}
