import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalisationAddPage } from './hospitalisation-add.page';

const routes: Routes = [
  {
    path: '',
    component: HospitalisationAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalisationAddPageRoutingModule {}
