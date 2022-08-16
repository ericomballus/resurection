import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { InventaireListPageRoutingModule } from "./inventaire-list-routing.module";

import { InventaireListPage } from "./inventaire-list.page";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventaireListPageRoutingModule,
    NgbModule,
    TranslateModule.forChild(),
  ],
  declarations: [InventaireListPage],
})
export class InventaireListPageModule {}
