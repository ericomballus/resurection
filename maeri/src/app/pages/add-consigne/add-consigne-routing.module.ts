import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddConsignePage } from './add-consigne.page';

const routes: Routes = [
  {
    path: '',
    component: AddConsignePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddConsignePageRoutingModule {}
