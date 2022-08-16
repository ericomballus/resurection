import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeforePrintPageRoutingModule } from './before-print-routing.module';

import { BeforePrintPage } from './before-print.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeforePrintPageRoutingModule
  ],
  declarations: [BeforePrintPage]
})
export class BeforePrintPageModule {}
