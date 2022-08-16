import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwTransactionPageRoutingModule } from './sw-transaction-routing.module';

import { SwTransactionPage } from './sw-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwTransactionPageRoutingModule
  ],
  declarations: [SwTransactionPage]
})
export class SwTransactionPageModule {}
