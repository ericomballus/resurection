import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickDateTimePageRoutingModule } from './pick-date-time-routing.module';

import { PickDateTimePage } from './pick-date-time.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickDateTimePageRoutingModule,
    NgbModule,
  ],
  declarations: [PickDateTimePage],
})
export class PickDateTimePageModule {}
