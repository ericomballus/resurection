import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScTransactionPageRoutingModule } from './sc-transaction-routing.module';

import { ScTransactionPage } from './sc-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScTransactionPageRoutingModule
  ],
  declarations: [ScTransactionPage]
})
export class ScTransactionPageModule {}
