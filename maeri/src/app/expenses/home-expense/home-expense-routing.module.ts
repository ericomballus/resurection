import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeExpensePage } from './home-expense.page';

const routes: Routes = [
  {
    path: '',
    component: HomeExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeExpensePageRoutingModule {}
