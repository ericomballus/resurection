import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayInventairePageRoutingModule } from './display-inventaire-routing.module';

import { DisplayInventairePage } from './display-inventaire.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayInventairePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [DisplayInventairePage],
})
export class DisplayInventairePageModule {}
