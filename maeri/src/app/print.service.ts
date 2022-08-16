import { Injectable } from '@angular/core';
//import domtoimage from "dom-to-image";
//import * as domtoimage from "dom-to-image";
@Injectable({
  providedIn: 'root',
})
export class PrintService {
  url = '../assets/image3.png';
  constructor() {}

  print(componentName) {
    var node = document.getElementById(componentName);

    /*  domtoimage
      .toPng(node)
      .then(function(dataUrl) {
        var popup = window.open();
        popup.document.write("<img src=" + dataUrl + ">");
        popup.document.close();
        popup.focus();
        popup.print();
        popup.close();
      })
      .catch(function(error) {
        console.error("oops, something went wrong!", error);
      }); */
  }
}
