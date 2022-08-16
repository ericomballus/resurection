import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreCustomerPageRoutingModule } from './store-customer-routing.module';

import { StoreCustomerPage } from './store-customer.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreCustomerPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [StoreCustomerPage],
})
export class StoreCustomerPageModule {}
