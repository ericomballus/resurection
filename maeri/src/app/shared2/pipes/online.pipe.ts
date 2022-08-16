import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "online",
})
export class OnlinePipe implements PipeTransform {
  transform(user: unknown): unknown {
    // console.log(user);
    if (user["userConnection"]) {
      let conn = user["userConnection"]["lastConnection"];

      let last = new Date(conn).getTime();
      // console.log(last);
      let time = new Date().getTime();
      let res = time - last;
      // console.log(time - last);
      if (res < 500000) {
        return true;
      } else {
        //let text = '<p style="color: red">' + "offline" + "</p>";
        return false;
      }
    }

    return null;
  }
}
