import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerRefuelingPageRoutingModule } from './manager-refueling-routing.module';

import { ManagerRefuelingPage } from './manager-refueling.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerRefuelingPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ManagerRefuelingPage],
})
export class ManagerRefuelingPageModule {}
