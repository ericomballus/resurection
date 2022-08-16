import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZoneExpeditionPageRoutingModule } from './zone-expedition-routing.module';

import { ZoneExpeditionPage } from './zone-expedition.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZoneExpeditionPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ZoneExpeditionPage],
})
export class ZoneExpeditionPageModule {}
