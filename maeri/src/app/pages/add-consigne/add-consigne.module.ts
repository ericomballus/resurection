import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddConsignePageRoutingModule } from './add-consigne-routing.module';

import { AddConsignePage } from './add-consigne.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddConsignePageRoutingModule
  ],
  declarations: [AddConsignePage]
})
export class AddConsignePageModule {}
