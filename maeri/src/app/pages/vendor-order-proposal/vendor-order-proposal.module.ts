import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorOrderProposalPageRoutingModule } from './vendor-order-proposal-routing.module';

import { VendorOrderProposalPage } from './vendor-order-proposal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorOrderProposalPageRoutingModule
  ],
  declarations: [VendorOrderProposalPage]
})
export class VendorOrderProposalPageModule {}
