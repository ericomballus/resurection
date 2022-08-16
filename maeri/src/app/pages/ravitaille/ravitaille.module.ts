import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillePageRoutingModule } from './ravitaille-routing.module';

import { RavitaillePage } from './ravitaille.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RavitaillePageRoutingModule
  ],
  declarations: [RavitaillePage]
})
export class RavitaillePageModule {}
