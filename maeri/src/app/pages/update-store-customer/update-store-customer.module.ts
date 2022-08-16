import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateStoreCustomerPageRoutingModule } from './update-store-customer-routing.module';

import { UpdateStoreCustomerPage } from './update-store-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateStoreCustomerPageRoutingModule
  ],
  declarations: [UpdateStoreCustomerPage]
})
export class UpdateStoreCustomerPageModule {}
