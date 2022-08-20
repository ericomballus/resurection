import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectStockPageRoutingModule } from './select-stock-routing.module';

import { SelectStockPage } from './select-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectStockPageRoutingModule
  ],
  declarations: [SelectStockPage]
})
export class SelectStockPageModule {}
