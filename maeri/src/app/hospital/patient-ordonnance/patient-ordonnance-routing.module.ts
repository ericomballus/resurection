import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientOrdonnancePage } from './patient-ordonnance.page';

const routes: Routes = [
  {
    path: '',
    component: PatientOrdonnancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientOrdonnancePageRoutingModule {}
