import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickCustomerPageRoutingModule } from './pick-customer-routing.module';

import { PickCustomerPage } from './pick-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickCustomerPageRoutingModule
  ],
  declarations: [PickCustomerPage]
})
export class PickCustomerPageModule {}
