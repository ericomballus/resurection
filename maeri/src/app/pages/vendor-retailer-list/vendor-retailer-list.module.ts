import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorRetailerListPageRoutingModule } from './vendor-retailer-list-routing.module';

import { VendorRetailerListPage } from './vendor-retailer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorRetailerListPageRoutingModule
  ],
  declarations: [VendorRetailerListPage]
})
export class VendorRetailerListPageModule {}
