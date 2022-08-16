import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsignePageRoutingModule } from './consigne-routing.module';

import { ConsignePage } from './consigne.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsignePageRoutingModule
  ],
  declarations: [ConsignePage]
})
export class ConsignePageModule {}
