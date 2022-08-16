import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeRetailerProductAddPageRoutingModule } from './employee-retailer-product-add-routing.module';

import { EmployeeRetailerProductAddPage } from './employee-retailer-product-add.page';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeRetailerProductAddPageRoutingModule,
    ShareModule,
  ],
  declarations: [EmployeeRetailerProductAddPage],
})
export class EmployeeRetailerProductAddPageModule {}
