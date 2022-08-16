import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GammeUpdatePageRoutingModule } from './gamme-update-routing.module';

import { GammeUpdatePage } from './gamme-update.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GammeUpdatePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [GammeUpdatePage],
})
export class GammeUpdatePageModule {}
