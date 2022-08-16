import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FicheListPageRoutingModule } from './fiche-list-routing.module';

import { FicheListPage } from './fiche-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FicheListPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [FicheListPage],
})
export class FicheListPageModule {}
