import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderBonusPageRoutingModule } from './leader-bonus-routing.module';

import { LeaderBonusPage } from './leader-bonus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaderBonusPageRoutingModule
  ],
  declarations: [LeaderBonusPage]
})
export class LeaderBonusPageModule {}
