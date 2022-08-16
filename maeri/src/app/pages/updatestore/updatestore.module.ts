import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdatestorePageRoutingModule } from './updatestore-routing.module';

import { UpdatestorePage } from './updatestore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdatestorePageRoutingModule
  ],
  declarations: [UpdatestorePage]
})
export class UpdatestorePageModule {}
