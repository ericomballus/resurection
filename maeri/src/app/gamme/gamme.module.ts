import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GammePageRoutingModule } from './gamme-routing.module';

import { GammePage } from './gamme.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GammePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [GammePage],
})
export class GammePageModule {}
