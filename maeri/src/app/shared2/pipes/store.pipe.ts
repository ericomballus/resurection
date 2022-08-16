import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Injector,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { promise } from "protractor";
import { AdminService } from "src/app/services/admin.service";

@Pipe({
  name: "store",
  pure: false,
})
export class StorePipe implements PipeTransform {
  adminData = null;
  allStore = [];
  private asyncPipe: AsyncPipe;
  constructor(public adminService: AdminService) {}

  transform(value: any | (() => any | Promise<any>)): any {
    return this.asyncPipe.transform(this.takeName(value));
  }

  takeName(value) {
    return new Promise((resolve, reject) => {
      let adminId = JSON.parse(localStorage.getItem("user"))["adminId"];
      let storeName = "";
      if (!this.adminData) {
        console.log(value);

        this.adminService.getUserById(adminId).subscribe((result) => {
          this.adminData = result["users"];

          let USER = result["users"][0]["storeId"];
          let store = USER.filter((str) => {
            console.log(`store Id ${str.id}  ===> ${value[0]["storeId"]}`);

            return str.id == value[0]["storeId"];
          });
          console.log(store);
          if (store.length) {
            storeName = store[0]["name"];
          } else {
            storeName = "no name";
          }
          resolve(storeName);
        });
      } else {
      }
    });
  }
}
