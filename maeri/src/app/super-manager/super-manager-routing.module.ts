import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuperManagerPage } from './super-manager.page';

const routes: Routes = [
  {
    path: '',
    component: SuperManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperManagerPageRoutingModule {}
