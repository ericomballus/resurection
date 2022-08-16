import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-displayproduct",
  templateUrl: "./displayproduct.component.html",
  styleUrls: ["./displayproduct.component.scss"],
})
export class DisplayproductComponent implements OnInit {
  @Input() public product;
  constructor() {}

  ngOnInit() {}
}
