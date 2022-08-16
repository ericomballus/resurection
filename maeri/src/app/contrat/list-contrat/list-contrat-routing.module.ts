import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ListContratPage } from './list-contrat.page';

const routes: Routes = [
  {
    path: '',
    component: ListContratPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule.forChild()],
  exports: [RouterModule],
})
export class ListContratPageRoutingModule {}
