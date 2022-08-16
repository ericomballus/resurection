import { Injectable } from "@angular/core";
import { isNullOrUndefined } from "util";
import { UrlService } from "./url.service";
import { environment, uri } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SelectvendorService {
  vendor: any;
  cart: any;
  url: string;
  order: any;
  vendorProducts: any;
  proposalOrder: any;
  proposalOrder2: any;
  constructor(private urlService: UrlService, private http: HttpClient) {
    this.takeUrl();
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }
  setData(data) {
    this.vendor = data;
  }

  getData() {
    if (isNullOrUndefined(this.vendor)) {
      return 0;
    } else {
      return this.vendor;
    }
  }
  setCart(data) {
    this.cart = data;
    //hello
  }
  getCart() {
    if (isNullOrUndefined(this.cart)) {
      return 0;
    } else {
      return this.cart;
    }
  }

  postOrder(order) {
    console.log(this.url);

    return this.http.post(this.url + "retailerOrder", order);
  }

  postProposalOrder(order) {
    console.log(this.url);

    return this.http.post(this.url + "proposalOrder", order);
  }

  confirmOrderReceive(order) {
    console.log(this.url);

    return this.http.put(this.url + `retailerOrder/adminId`, order);
  }

  confirmOrderPaid(order) {
    console.log(this.url);

    return this.http.put(this.url + `retailerOrder/order/vendor/paid`, order);
  }

  cancelOrderReceive(order) {
    console.log(this.url);

    return this.http.put(this.url + `retailerOrder/adminId`, order);
  }
  updateOrderHourLivraison(order) {
    console.log(this.url);

    return this.http.put(this.url + `retailerOrder/adminId/hours`, order);
  }

  get5LastOrders(vendorId) {
    console.log(this.url);
    return this.http.get(this.url + `retailerOrder/${vendorId}`);
  }

  getNotConfirmOrders(vendorId) {
    return this.http.get(
      this.url + `retailerOrder/${vendorId}/notconfirm?vendorId=${vendorId}`
    );
  }

  retailerGetOrders(retailerId) {
    return this.http.get(
      this.url +
        `retailerOrder/${retailerId}/notconfirm?retailerId=${retailerId}`
    );
  }

  retailerGetOrdersProposal(retailerId) {
    return this.http.get(
      this.url +
        `proposalOrder/${retailerId}/notconfirm?retailerId=${retailerId}`
    );
  }

  vendorGetOrdersProposal(vendorId) {
    return this.http.get(
      this.url + `proposalOrder/${vendorId}/notconfirm?vendorId=${vendorId}`
    );
  }
  updateOrdersProposal(order) {
    return this.http.put(this.url + `proposalOrder`, order);
  }

  setOrder(data) {
    this.order = data;
  }

  getOrder() {
    if (isNullOrUndefined(this.order)) {
      return 0;
    } else {
      return this.order;
    }
  }

  setProposalOrder(data) {
    this.proposalOrder = data;
  }

  getProposalOrder() {
    if (isNullOrUndefined(this.proposalOrder)) {
      return 0;
    } else {
      return this.proposalOrder;
    }
  }

  setProposalOrder2(data) {
    this.proposalOrder2 = data;
  }

  getProposalOrder2() {
    if (isNullOrUndefined(this.proposalOrder2)) {
      return 0;
    } else {
      return this.proposalOrder2;
    }
  }

  setProducts(data) {
    this.vendorProducts = data;
  }

  getProducts() {
    if (isNullOrUndefined(this.vendorProducts)) {
      return 0;
    } else {
      return this.vendorProducts;
    }
  }
}
