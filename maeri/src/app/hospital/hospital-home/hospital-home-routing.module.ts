import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalHomePage } from './hospital-home.page';

const routes: Routes = [
  {
    path: '',
    component: HospitalHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalHomePageRoutingModule {}
