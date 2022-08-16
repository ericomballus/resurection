import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeleteBillPage } from './delete-bill.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteBillPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeleteBillPageRoutingModule {}
