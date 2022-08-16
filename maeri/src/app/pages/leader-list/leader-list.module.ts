import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderListPageRoutingModule } from './leader-list-routing.module';

import { LeaderListPage } from './leader-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaderListPageRoutingModule
  ],
  declarations: [LeaderListPage]
})
export class LeaderListPageModule {}
