import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwTransactionPage } from './sw-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: SwTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwTransactionPageRoutingModule {}
