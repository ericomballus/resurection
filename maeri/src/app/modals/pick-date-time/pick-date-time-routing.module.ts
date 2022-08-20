import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickDateTimePage } from './pick-date-time.page';

const routes: Routes = [
  {
    path: '',
    component: PickDateTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickDateTimePageRoutingModule {}
