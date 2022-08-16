import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorOrderProposalPage } from './vendor-order-proposal.page';

const routes: Routes = [
  {
    path: '',
    component: VendorOrderProposalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorOrderProposalPageRoutingModule {}
