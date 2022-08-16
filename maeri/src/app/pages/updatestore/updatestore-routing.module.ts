import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdatestorePage } from './updatestore.page';

const routes: Routes = [
  {
    path: '',
    component: UpdatestorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatestorePageRoutingModule {}
