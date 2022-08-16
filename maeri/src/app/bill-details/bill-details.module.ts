import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillDetailsPageRoutingModule } from './bill-details-routing.module';

import { BillDetailsPage } from './bill-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from '../share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillDetailsPageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [BillDetailsPage],
})
export class BillDetailsPageModule {}
