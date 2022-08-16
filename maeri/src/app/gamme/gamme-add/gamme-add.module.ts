import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GammeAddPageRoutingModule } from './gamme-add-routing.module';

import { GammeAddPage } from './gamme-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GammeAddPageRoutingModule
  ],
  declarations: [GammeAddPage]
})
export class GammeAddPageModule {}
