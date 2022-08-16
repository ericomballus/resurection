import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickEmployeeRetailerPageRoutingModule } from './pick-employee-retailer-routing.module';

import { PickEmployeeRetailerPage } from './pick-employee-retailer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickEmployeeRetailerPageRoutingModule
  ],
  declarations: [PickEmployeeRetailerPage]
})
export class PickEmployeeRetailerPageModule {}
