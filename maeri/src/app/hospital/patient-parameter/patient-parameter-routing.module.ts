import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientParameterPage } from './patient-parameter.page';

const routes: Routes = [
  {
    path: '',
    component: PatientParameterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientParameterPageRoutingModule {}
