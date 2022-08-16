import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeRetailerListPageRoutingModule } from './employee-retailer-list-routing.module';

import { EmployeeRetailerListPage } from './employee-retailer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeRetailerListPageRoutingModule
  ],
  declarations: [EmployeeRetailerListPage]
})
export class EmployeeRetailerListPageModule {}
