import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetailerModalPageRoutingModule } from './retailer-modal-routing.module';

import { RetailerModalPage } from './retailer-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetailerModalPageRoutingModule
  ],
  declarations: [RetailerModalPage]
})
export class RetailerModalPageModule {}
