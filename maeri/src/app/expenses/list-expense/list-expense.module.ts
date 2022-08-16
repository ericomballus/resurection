import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListExpensePageRoutingModule } from './list-expense-routing.module';

import { ListExpensePage } from './list-expense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListExpensePageRoutingModule
  ],
  declarations: [ListExpensePage]
})
export class ListExpensePageModule {}
