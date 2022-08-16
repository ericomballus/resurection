import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScTransactionPage } from './sc-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: ScTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScTransactionPageRoutingModule {}
