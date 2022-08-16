import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillardUpdatePageRoutingModule } from './billard-update-routing.module';

import { BillardUpdatePage } from './billard-update.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillardUpdatePageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [BillardUpdatePage],
})
export class BillardUpdatePageModule {}
