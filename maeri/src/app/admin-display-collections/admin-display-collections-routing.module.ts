import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminDisplayCollectionsPage } from './admin-display-collections.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDisplayCollectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDisplayCollectionsPageRoutingModule {}
