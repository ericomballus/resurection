import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagerDisplayBillPageRoutingModule } from './manager-display-bill-routing.module';

import { ManagerDisplayBillPage } from './manager-display-bill.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagerDisplayBillPageRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
  ],
  declarations: [ManagerDisplayBillPage],
})
export class ManagerDisplayBillPageModule {}
