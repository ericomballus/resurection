import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScDisplayStockPageRoutingModule } from './sc-display-stock-routing.module';

import { ScDisplayStockPage } from './sc-display-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScDisplayStockPageRoutingModule
  ],
  declarations: [ScDisplayStockPage]
})
export class ScDisplayStockPageModule {}
