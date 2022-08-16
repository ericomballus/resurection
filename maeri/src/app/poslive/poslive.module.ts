import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PoslivePageRoutingModule } from './poslive-routing.module';

import { PoslivePage } from './poslive.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoslivePageRoutingModule,
    // RouterModule.forChild(routes),

    TranslateModule.forChild(),
  ],
  declarations: [PoslivePage],
})
export class PoslivePageModule {}
