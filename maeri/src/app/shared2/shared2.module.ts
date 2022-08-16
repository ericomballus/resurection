import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OnlinePipe } from "./pipes/online.pipe";
import { StorePipe } from "./pipes/store.pipe";

@NgModule({
  declarations: [OnlinePipe, StorePipe],
  imports: [CommonModule],
  exports: [OnlinePipe, StorePipe],
})
export class Shared2Module {}
