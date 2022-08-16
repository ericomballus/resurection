import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillePage } from './ravitaille.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillePageRoutingModule {}
