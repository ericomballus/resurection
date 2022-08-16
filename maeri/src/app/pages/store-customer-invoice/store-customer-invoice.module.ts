import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreCustomerInvoicePageRoutingModule } from './store-customer-invoice-routing.module';

import { StoreCustomerInvoicePage } from './store-customer-invoice.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreCustomerInvoicePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [StoreCustomerInvoicePage],
})
export class StoreCustomerInvoicePageModule {}
