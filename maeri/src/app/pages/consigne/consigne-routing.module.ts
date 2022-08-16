import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsignePage } from './consigne.page';

const routes: Routes = [
  {
    path: '',
    component: ConsignePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsignePageRoutingModule {}
