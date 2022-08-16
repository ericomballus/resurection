import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListExpensePage } from './list-expense.page';

const routes: Routes = [
  {
    path: '',
    component: ListExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListExpensePageRoutingModule {}
