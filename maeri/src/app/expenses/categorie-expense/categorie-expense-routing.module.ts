import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorieExpensePage } from './categorie-expense.page';

const routes: Routes = [
  {
    path: '',
    component: CategorieExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategorieExpensePageRoutingModule {}
