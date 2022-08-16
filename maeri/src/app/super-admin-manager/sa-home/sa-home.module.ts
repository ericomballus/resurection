import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaHomePageRoutingModule } from './sa-home-routing.module';

import { SaHomePage } from './sa-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaHomePageRoutingModule
  ],
  declarations: [SaHomePage]
})
export class SaHomePageModule {}
