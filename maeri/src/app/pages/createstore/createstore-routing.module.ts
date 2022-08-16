import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatestorePage } from './createstore.page';

const routes: Routes = [
  {
    path: '',
    component: CreatestorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatestorePageRoutingModule {}
