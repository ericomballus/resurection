import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetailerDisplayOrderProposalPageRoutingModule } from './retailer-display-order-proposal-routing.module';

import { RetailerDisplayOrderProposalPage } from './retailer-display-order-proposal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetailerDisplayOrderProposalPageRoutingModule
  ],
  declarations: [RetailerDisplayOrderProposalPage]
})
export class RetailerDisplayOrderProposalPageModule {}
