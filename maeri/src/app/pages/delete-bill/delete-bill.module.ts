import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteBillPageRoutingModule } from './delete-bill-routing.module';

import { DeleteBillPage } from './delete-bill.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeleteBillPageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [DeleteBillPage],
})
export class DeleteBillPageModule {}
