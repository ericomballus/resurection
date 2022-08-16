import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillPageRoutingModule } from './bill-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { BillPage } from './bill.page';
import { ShareModule } from '../share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillPageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [BillPage],
})
export class BillPageModule {}
