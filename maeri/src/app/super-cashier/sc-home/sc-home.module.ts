import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScHomePageRoutingModule } from './sc-home-routing.module';

import { ScHomePage } from './sc-home.page';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScHomePageRoutingModule,
    ShareModule,
  ],
  declarations: [ScHomePage],
})
export class ScHomePageModule {}
