import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { EmployeesUpdatePasswordPage } from "./employees-update-password.page";

const routes: Routes = [
  {
    path: "",
    component: EmployeesUpdatePasswordPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  declarations: [EmployeesUpdatePasswordPage],
})
export class EmployeesUpdatePasswordPageModule {}
