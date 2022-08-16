import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientAddPage } from './patient-add.page';

const routes: Routes = [
  {
    path: '',
    component: PatientAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientAddPageRoutingModule {}
