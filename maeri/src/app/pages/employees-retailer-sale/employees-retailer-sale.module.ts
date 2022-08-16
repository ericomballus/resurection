import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeesRetailerSalePageRoutingModule } from './employees-retailer-sale-routing.module';

import { EmployeesRetailerSalePage } from './employees-retailer-sale.page';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeesRetailerSalePageRoutingModule,
    ShareModule,
  ],
  declarations: [EmployeesRetailerSalePage],
})
export class EmployeesRetailerSalePageModule {}
