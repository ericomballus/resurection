import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-restostock",
  templateUrl: "./restostock.component.html",
  styleUrls: ["./restostock.component.scss"],
})
export class RestostockComponent implements OnInit {
  @Input() public products;
  constructor() {
    setTimeout(() => {
      console.log(this.products);
    }, 5000);
  }

  ngOnInit() {}
}
