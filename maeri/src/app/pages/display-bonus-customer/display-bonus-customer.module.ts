import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayBonusCustomerPageRoutingModule } from './display-bonus-customer-routing.module';

import { DisplayBonusCustomerPage } from './display-bonus-customer.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayBonusCustomerPageRoutingModule,
    NgbModule,
  ],
  declarations: [DisplayBonusCustomerPage],
})
export class DisplayBonusCustomerPageModule {}
