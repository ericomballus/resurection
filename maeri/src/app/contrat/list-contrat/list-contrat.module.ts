import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListContratPageRoutingModule } from './list-contrat-routing.module';

import { ListContratPage } from './list-contrat.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListContratPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [ListContratPage],
})
export class ListContratPageModule {}
