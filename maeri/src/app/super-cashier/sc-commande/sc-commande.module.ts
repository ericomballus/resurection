import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScCommandePageRoutingModule } from './sc-commande-routing.module';

import { ScCommandePage } from './sc-commande.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScCommandePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ScCommandePage],
})
export class ScCommandePageModule {}
