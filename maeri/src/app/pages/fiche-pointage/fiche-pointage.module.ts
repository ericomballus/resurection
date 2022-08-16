import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichePointagePageRoutingModule } from './fiche-pointage-routing.module';

import { FichePointagePage } from './fiche-pointage.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FichePointagePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [FichePointagePage],
})
export class FichePointagePageModule {}
