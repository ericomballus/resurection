(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[7467],{7467:(n,t,e)=>{"use strict";e.r(t),e.d(t,{RetailerModalPageModule:()=>w});var o=e(1511),i=e(6073),r=e(8158),c=e(8777),s=e(4762),a=e(1572),d=e(3400),g=e(2874),l=e(5946),p=e(5604),f=e(4144);function h(n,t){1&n&&(a.TgZ(0,"ion-buttons",10),a._UZ(1,"ion-back-button",11),a.qZA())}function u(n,t){1&n&&(a.TgZ(0,"ion-buttons",10),a._UZ(1,"ion-back-button",11),a.qZA())}function m(n,t){1&n&&(a.TgZ(0,"ion-label",12),a._uU(1,"LIVRAISON "),a.qZA())}function C(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"ion-datetime",13),a.NdJ("ionChange",function(t){return a.CHM(n),a.oxw().getLivraisonTime(t)}),a.qZA()}if(2&n){const n=a.oxw();a.Q6J("value",n.order.dateLivraison)}}function b(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"ion-button",14),a.NdJ("click",function(){return a.CHM(n),a.oxw().cancelProposal()}),a._uU(1," annuler "),a.qZA()}}function O(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"ion-button",15),a.NdJ("click",function(){return a.CHM(n),a.oxw().confirmOrders()}),a._uU(1," confirm "),a.qZA()}}function x(n,t){if(1&n&&(a.TgZ(0,"div",7),a._uU(1),a.ALo(2,"currency"),a.qZA()),2&n){const n=a.oxw().$implicit;a.xp6(1),a.hij(" ",a.gM2(2,1,n.item.packPrice,"CFA","symbol","3.0-0")," ")}}const M=function(n){return{"background-color":n}};function _(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"ion-row",16),a.TgZ(1,"ion-col",6),a.TgZ(2,"div",7),a._uU(3),a.qZA(),a.qZA(),a.TgZ(4,"ion-col",6),a.YNc(5,x,3,6,"div",17),a.qZA(),a.TgZ(6,"ion-col",6),a.TgZ(7,"div",7),a.TgZ(8,"ion-input",18),a.NdJ("ionChange",function(e){a.CHM(n);const o=t.$implicit,i=t.index;return a.oxw().addIncrement(e,o,i)}),a.qZA(),a.qZA(),a.qZA(),a.TgZ(9,"ion-col",6),a.TgZ(10,"div",7),a._uU(11),a.ALo(12,"currency"),a.qZA(),a.qZA(),a.qZA()}if(2&n){const n=t.$implicit;a.xp6(3),a.Oqu(n.item.name),a.xp6(2),a.Q6J("ngIf",n.item.packPrice),a.xp6(3),a.Q6J("ngStyle",a.VKq(10,M,n.alert?"red":"white"))("value",n.qty),a.xp6(3),a.hij(" ",a.gM2(12,5,n.coast,"CFA","symbol","3.0-0")," ")}}function P(n,t){1&n&&(a.TgZ(0,"ion-row"),a.TgZ(1,"ion-col",19),a.TgZ(2,"div",20),a._uU(3,"commande valid\xe9"),a.qZA(),a.qZA(),a.qZA())}function v(n,t){1&n&&(a.TgZ(0,"ion-row"),a.TgZ(1,"ion-col",19),a.TgZ(2,"div",20),a._uU(3,"commande rejett\xe9"),a.qZA(),a.qZA(),a.qZA())}const Z=[{path:"",component:(()=>{class n{constructor(n,t,e,o,i,r,c){this.vendorService=n,this.router=t,this.notif=e,this.adminService=o,this.countItemsService=i,this.restApiService=r,this.loadingController=c,this.disable=!0,this.retailer=!1,this.vendor=!1,this.isLoading=!1,this.randomObj={}}ngOnInit(){this.order=this.vendorService.getProposalOrder2(),console.log(this.order),"string"==typeof this.order.vendorId?this.order.catchVendor=!1:this.order.catchRetailer=!0}getLivraisonTime(n){this.date=new Date(n.target.value),this.disable=!this.disable}confirmOrder(){console.log(this.order),this.order.vendorConfirm=!0,this.order.status=2,this.date&&(this.order.dateLivraison=this.date,this.order.maxChanges=this.order.maxChanges+1),this.vendorService.confirmOrderReceive(this.order).subscribe(n=>{this.router.navigateByUrl("vendor-orders"),this.notif.presentToast("confirmation reception commande ok","success")})}confirmOrderReception(){this.order.orderConfirm=!0,this.vendorService.confirmOrderReceive(this.order).subscribe(n=>{this.router.navigateByUrl("vendor-orders"),this.notif.presentToast("confirmation reception commande ok","success")})}cancelOrder(){this.order.vendorConfirm=!1,this.order.status=0,this.order.paid=!1,console.log(this.order),this.order.restorProduct=2,this.vendorService.cancelOrderReceive(this.order).subscribe(n=>{this.router.navigateByUrl("vendor-orders"),this.notif.presentToast("la commande a \xe9t\xe9 annul\xe9","danger")})}cancelProposal(){this.order.dateLivraison=this.date,this.order.display=!1,this.order.retailerConfirm=!1,this.vendorService.updateOrdersProposal(this.order).subscribe(n=>{this.notif.presentToast("commande annuler modifier","success")})}confirmHours(){this.vendorService.updateOrderHourLivraison(this.order).subscribe(n=>{this.notif.presentToast("heure de livraison confirm\xe9","success")})}confirmOrders(){this.order.display=!1,this.order.retailerConfirm=!0,this.order.vendorId=this.order.vendorId._id,this.order.retailerId=this.order.retailerId,this.order.livraisonDateConfirm=1,this.posOrder(this.order)}posOrder(n){this.vendorService.postOrder(n).subscribe(t=>{this.vendorService.updateOrdersProposal(n).subscribe(n=>{console.log(n)}),this.dismissLoading(),setTimeout(()=>{this.router.navigateByUrl("retailer-display-order-proposal")},4e3),this.notif.presentToast("votre a \xe9t\xe9 commande envoy\xe9","success")})}presentLoading2(){return(0,s.mG)(this,void 0,void 0,function*(){return this.isLoading=!0,yield this.loadingController.create({duration:8e3,message:"please wait ..."}).then(n=>{n.present().then(()=>{this.isLoading||n.dismiss().then()})})})}dismissLoading(){return(0,s.mG)(this,void 0,void 0,function*(){return this.isLoading=!1,yield this.loadingController.dismiss().then()})}addIncrement(n,t,e){let o=parseInt(n.target.value);console.log(t),console.log(this.order.commandes),Number.isNaN(o)||(t.qty=o,t.sale=o,t.price=o*o*t.item.packPrice,t.coast=o*t.item.packPrice)}}return n.\u0275fac=function(t){return new(t||n)(a.Y36(d.A),a.Y36(c.F0),a.Y36(g.g),a.Y36(l.l),a.Y36(p.w),a.Y36(f.e),a.Y36(r.HT))},n.\u0275cmp=a.Xpm({type:n,selectors:[["app-retailer-modal"]],decls:26,vars:9,consts:[["slot","start",4,"ngIf"],["class","tailleLivraison",4,"ngIf"],["class","ion-datetime","displayFormat","MMM DD, YYYY HH:mm","pickerFormat","MMM DD, YYYY HH:mm",3,"value","ionChange",4,"ngIf"],["class","btnb","slot","end","size","small","color","light",3,"click",4,"ngIf"],["class","btnb","slot","end",3,"click",4,"ngIf"],[1,"second-lastrow"],["size","3"],[1,"ion-text-center","inte"],["class","data-row data-update",4,"ngFor","ngForOf"],[4,"ngIf"],["slot","start"],["defaultHref","/retailer-display-order-proposal"],[1,"tailleLivraison"],["displayFormat","MMM DD, YYYY HH:mm","pickerFormat","MMM DD, YYYY HH:mm",1,"ion-datetime",3,"value","ionChange"],["slot","end","size","small","color","light",1,"btnb",3,"click"],["slot","end",1,"btnb",3,"click"],[1,"data-row","data-update"],["class","ion-text-center inte",4,"ngIf"],["slot","end","placeholder","bouteille","type","number","debounce","700",3,"ngStyle","value","ionChange"],["size","12"],[1,"ion-text-center"]],template:function(n,t){1&n&&(a.TgZ(0,"ion-header"),a.TgZ(1,"ion-toolbar"),a.YNc(2,h,2,0,"ion-buttons",0),a.YNc(3,u,2,0,"ion-buttons",0),a.qZA(),a.qZA(),a.TgZ(4,"ion-content"),a.TgZ(5,"ion-item"),a.YNc(6,m,2,0,"ion-label",1),a.YNc(7,C,1,1,"ion-datetime",2),a.YNc(8,b,2,0,"ion-button",3),a.YNc(9,O,2,0,"ion-button",4),a.qZA(),a.TgZ(10,"ion-row",5),a.TgZ(11,"ion-col",6),a.TgZ(12,"div",7),a._uU(13,"name"),a.qZA(),a.qZA(),a.TgZ(14,"ion-col",6),a.TgZ(15,"div",7),a._uU(16,"price"),a.qZA(),a.qZA(),a.TgZ(17,"ion-col",6),a.TgZ(18,"div",7),a._uU(19,"Qty"),a.qZA(),a.qZA(),a.TgZ(20,"ion-col",6),a.TgZ(21,"div",7),a._uU(22,"T.price"),a.qZA(),a.qZA(),a.qZA(),a.YNc(23,_,13,12,"ion-row",8),a.YNc(24,P,4,0,"ion-row",9),a.YNc(25,v,4,0,"ion-row",9),a.qZA()),2&n&&(a.xp6(2),a.Q6J("ngIf",!t.order.adminId),a.xp6(1),a.Q6J("ngIf",t.order.adminId),a.xp6(3),a.Q6J("ngIf",0==t.order.livraisonDateConfirm),a.xp6(1),a.Q6J("ngIf",0==t.order.livraisonDateConfirm&&t.order.catchRetailer),a.xp6(1),a.Q6J("ngIf",t.order.catchRetailer),a.xp6(1),a.Q6J("ngIf",t.order.catchRetailer),a.xp6(14),a.Q6J("ngForOf",t.order.commandes),a.xp6(1),a.Q6J("ngIf",t.order.retailerConfirm),a.xp6(1),a.Q6J("ngIf",!t.order.retailerConfirm&&!t.order.catchRetailer))},directives:[r.Gu,r.sr,o.O5,r.W2,r.Ie,r.Nd,r.wI,o.sg,r.Sm,r.oU,r.cs,r.Q$,r.x4,r.QI,r.YG,r.pK,r.as,o.PC],pipes:[o.H9],styles:["ion-toolbar[_ngcontent-%COMP%]{background:--ion-color-primary}.lesbtn[_ngcontent-%COMP%]{flex-wrap:wrap}.circle[_ngcontent-%COMP%], .lesbtn[_ngcontent-%COMP%]{display:flex}.circle1[_ngcontent-%COMP%]{text-align:center}.circle1[_ngcontent-%COMP%], .circle2[_ngcontent-%COMP%]{width:80%;height:80%}.circle-progress[_ngcontent-%COMP%]{font-size:25px;position:relative;top:25%}.lesbtn2[_ngcontent-%COMP%]{font-size:50%;text-transform:uppercase}.shopbtn[_ngcontent-%COMP%]{position:relative;left:8px}.col[_ngcontent-%COMP%]{align-self:center}ion-badge[_ngcontent-%COMP%]{color:#fff;position:absolute;top:0;right:0;border-radius:100%}.label[_ngcontent-%COMP%]{font-size:70%}.imgavatar[_ngcontent-%COMP%]{width:30px;height:30px}.category-block[_ngcontent-%COMP%]{margin-bottom:4px}.category-banner[_ngcontent-%COMP%]{border-left:8px solid var(--ion-color-secondary);background:var(--ion-color-light);height:40px;padding:10px;font-weight:500}.allChart[_ngcontent-%COMP%], .allChart2[_ngcontent-%COMP%], .allChart3[_ngcontent-%COMP%]{background-color:#000}.flex-container[_ngcontent-%COMP%]{display:flex;align-items:stretch;background-color:#f1f1f1}.flex-container[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{width:100px;margin:10px;text-align:center;height:75px;font-size:10px;padding-top:10%;text-transform:uppercase}.flex-container[_ngcontent-%COMP%] > .div1[_ngcontent-%COMP%]{border:1px solid #f7ab1e}.flex-container[_ngcontent-%COMP%] > .div2[_ngcontent-%COMP%]{border:1px solid #1ef7f7}.flex-container[_ngcontent-%COMP%] > .div3[_ngcontent-%COMP%]{border:1px solid #6a1ef7}.flex-container[_ngcontent-%COMP%] > .div4[_ngcontent-%COMP%]{border:1px solid #f71ee5}.titleInDiv[_ngcontent-%COMP%]{text-align:center;font-size:7px;margin:0}.numberInDiv[_ngcontent-%COMP%]{text-align:center;font-weight:700;font-size:15px}.numberIntable[_ngcontent-%COMP%]{border:none;padding:10px;font-size:10px}.numberIntable[_ngcontent-%COMP%], .textRight[_ngcontent-%COMP%]{text-align:right}.textLeft[_ngcontent-%COMP%]{text-align:left}.textCenter[_ngcontent-%COMP%]{text-align:center}.table[_ngcontent-%COMP%], .table1[_ngcontent-%COMP%]{border:none}.table[_ngcontent-%COMP%]{padding:0}.productname[_ngcontent-%COMP%]{text-align:left;border:none;padding:10px;font-size:10px;color:#269af8}.resume[_ngcontent-%COMP%]{margin-top:15%}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#f1f1f1}th[_ngcontent-%COMP%]{border:none}.ionItem[_ngcontent-%COMP%]{width:100px;background-color:#000}div[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:11px;font-weight:700}ion-col[_ngcontent-%COMP%]{border:1px solid #f1f1f1}.header-row[_ngcontent-%COMP%]{padding-top:10px;padding-bottom:10px}.header-row[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:13px}.divResto[_ngcontent-%COMP%]{margin-top:100px}.alertStock[_ngcontent-%COMP%]{color:red;font-size:18px}.separationBlock[_ngcontent-%COMP%]{background-color:#494848;color:#fff;padding:15px;margin-top:15px}.desktop[_ngcontent-%COMP%]   ion-router-outlet[_ngcontent-%COMP%]{margin-top:56px;margin-bottom:56px}.desktop[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{max-height:40px}.desktop[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background:#374168}.desktop[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]{--color:var(--ion-color-light)}.desktop[_ngcontent-%COMP%]   .active-link[_ngcontent-%COMP%]{--color:var(--ion-color-primary)}.footer[_ngcontent-%COMP%]{width:100%;color:#fff;font-weight:700;background:#374168;height:56px;line-height:56px;text-align:center;position:fixed;bottom:0}.btnfooter[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{color:#494848;font-size:11px}ion-button[_ngcontent-%COMP%]   .btnmenu[_ngcontent-%COMP%], ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-flow:column nowrap;align-items:center}ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.btnfooter2[_ngcontent-%COMP%]{color:#494848;font-weight:bolder}.btnfooter2[_ngcontent-%COMP%], ion-col[_ngcontent-%COMP%]   .inte[_ngcontent-%COMP%]{font-size:11px}.second-lastrow[_ngcontent-%COMP%]{background-color:#ebbd40;padding-top:10px;padding-bottom:10px}.last-row[_ngcontent-%COMP%]{padding-top:1px;padding-bottom:1px}.lastBtn[_ngcontent-%COMP%]{background-color:#16f08a;padding-top:10px;padding-bottom:10px}ion-item[_ngcontent-%COMP%]{--padding-top:10px;--padding-bottom:10px;margin-left:0;margin-right:0;font-size:11px;font-weight:700}.contain[_ngcontent-%COMP%]{margin-top:10px}.ion-datetime[_ngcontent-%COMP%]{--padding-start:10px;--padding-end:10px;background-color:#85f33c;margin-right:10px}ion-item[_ngcontent-%COMP%]{float:none}.btnb[_ngcontent-%COMP%]{font-size:10px;margin:0 auto}.tailleLivraison[_ngcontent-%COMP%]{margin-right:5px}"]}),n})()}];let T=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=a.oAB({type:n}),n.\u0275inj=a.cJS({imports:[[c.Bz.forChild(Z)],c.Bz]}),n})(),w=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=a.oAB({type:n}),n.\u0275inj=a.cJS({imports:[[o.ez,i.u5,r.Pc,T]]}),n})()}}]);