import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-displaystock",
  templateUrl: "./displaystock.component.html",
  styleUrls: ["./displaystock.component.scss"],
})
export class DisplaystockComponent implements OnInit {
  @Input() public products;
  constructor() {}

  ngOnInit() {}
}
