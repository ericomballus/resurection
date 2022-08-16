import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsigneDisplayPageRoutingModule } from './consigne-display-routing.module';

import { ConsigneDisplayPage } from './consigne-display.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsigneDisplayPageRoutingModule
  ],
  declarations: [ConsigneDisplayPage]
})
export class ConsigneDisplayPageModule {}
