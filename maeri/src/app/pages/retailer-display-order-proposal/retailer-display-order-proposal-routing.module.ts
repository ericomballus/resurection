import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetailerDisplayOrderProposalPage } from './retailer-display-order-proposal.page';

const routes: Routes = [
  {
    path: '',
    component: RetailerDisplayOrderProposalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetailerDisplayOrderProposalPageRoutingModule {}
