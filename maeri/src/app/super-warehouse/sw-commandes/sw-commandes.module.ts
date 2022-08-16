import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwCommandesPageRoutingModule } from './sw-commandes-routing.module';

import { SwCommandesPage } from './sw-commandes.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwCommandesPageRoutingModule,
   TranslateModule.forChild(),
  ],
  declarations: [SwCommandesPage]
})
export class SwCommandesPageModule {}
