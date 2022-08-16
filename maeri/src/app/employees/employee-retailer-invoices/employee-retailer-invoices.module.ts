import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeRetailerInvoicesPageRoutingModule } from './employee-retailer-invoices-routing.module';

import { EmployeeRetailerInvoicesPage } from './employee-retailer-invoices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeRetailerInvoicesPageRoutingModule
  ],
  declarations: [EmployeeRetailerInvoicesPage]
})
export class EmployeeRetailerInvoicesPageModule {}
