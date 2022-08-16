import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseVoucherPageRoutingModule } from './purchase-voucher-routing.module';

import { PurchaseVoucherPage } from './purchase-voucher.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseVoucherPageRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
  ],
  declarations: [PurchaseVoucherPage],
})
export class PurchaseVoucherPageModule {}
