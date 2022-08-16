import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorModalPageRoutingModule } from './vendor-modal-routing.module';

import { VendorModalPage } from './vendor-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorModalPageRoutingModule
  ],
  declarations: [VendorModalPage]
})
export class VendorModalPageModule {}
