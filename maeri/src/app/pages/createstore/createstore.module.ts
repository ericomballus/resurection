import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatestorePageRoutingModule } from './createstore-routing.module';

import { CreatestorePage } from './createstore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatestorePageRoutingModule
  ],
  declarations: [CreatestorePage]
})
export class CreatestorePageModule {}
