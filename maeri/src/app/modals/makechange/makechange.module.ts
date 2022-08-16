import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakechangePageRoutingModule } from './makechange-routing.module';

import { MakechangePage } from './makechange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakechangePageRoutingModule
  ],
  declarations: [MakechangePage]
})
export class MakechangePageModule {}
