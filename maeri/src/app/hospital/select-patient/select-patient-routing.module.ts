import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPatientPage } from './select-patient.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPatientPageRoutingModule {}
