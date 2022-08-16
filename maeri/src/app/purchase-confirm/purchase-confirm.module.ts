import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseConfirmPageRoutingModule } from './purchase-confirm-routing.module';

import { PurchaseConfirmPage } from './purchase-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseConfirmPageRoutingModule
  ],
  declarations: [PurchaseConfirmPage]
})
export class PurchaseConfirmPageModule {}
