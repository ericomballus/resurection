import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwDisplayCommandePageRoutingModule } from './sw-display-commande-routing.module';

import { SwDisplayCommandePage } from './sw-display-commande.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwDisplayCommandePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [SwDisplayCommandePage],
})
export class SwDisplayCommandePageModule {}
