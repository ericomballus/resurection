(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[9715],{9715:(t,n,e)=>{"use strict";e.r(n),e.d(n,{RetailerOrderPageModule:()=>U});var o=e(1511),i=e(6073),r=e(8158),c=e(8777),l=e(4762),s=e(1344),a=e.n(s),g=e(1886),d=e(9764),p=e(8289),u=e(9996),f=e(1572),x=e(3400),m=e(2968),h=e(2874),_=e(4144),C=e(5946),P=e(5604);function v(t,n){1&t&&(f.TgZ(0,"div",15),f._uU(1," en attente "),f.qZA())}function O(t,n){1&t&&(f.TgZ(0,"div",15),f._uU(1," confirm\xe9 "),f.qZA())}function M(t,n){1&t&&(f.TgZ(0,"div",16),f._uU(1," en traitement "),f.qZA())}function b(t,n){1&t&&(f.TgZ(0,"div",17),f._uU(1," marchandise livr\xe9 "),f.qZA())}function Z(t,n){1&t&&(f.TgZ(0,"div",18),f._uU(1," livraison re\xe7u "),f.qZA())}function k(t,n){1&t&&(f.TgZ(0,"div",19),f._uU(1," pay\xe9 non livr\xe9 "),f.qZA())}function q(t,n){1&t&&(f.TgZ(0,"div",19),f._uU(1," pay\xe9 non re\xe7u "),f.qZA())}function I(t,n){1&t&&(f.TgZ(0,"div",19),f._uU(1,"pay\xe9"),f.qZA())}function A(t,n){1&t&&(f.TgZ(0,"div",20),f._uU(1," rejett\xe9 "),f.qZA())}const T=function(t){return{"background-color":t}};function y(t,n){if(1&t){const t=f.EpF();f.TgZ(0,"ion-row",8),f.NdJ("click",function(){f.CHM(t);const e=n.$implicit;return f.oxw().presentModal(e)}),f.TgZ(1,"ion-col",5),f.TgZ(2,"div",6),f._uU(3),f.ALo(4,"date"),f.ALo(5,"date"),f.qZA(),f.qZA(),f.TgZ(6,"ion-col",5),f.TgZ(7,"div",6),f._uU(8),f.qZA(),f.qZA(),f.TgZ(9,"ion-col",5),f.TgZ(10,"div",6),f._uU(11),f.ALo(12,"date"),f.qZA(),f.qZA(),f.TgZ(13,"ion-col",5),f.YNc(14,v,2,0,"div",9),f.YNc(15,O,2,0,"div",9),f.YNc(16,M,2,0,"div",10),f.YNc(17,b,2,0,"div",11),f.YNc(18,Z,2,0,"div",12),f.YNc(19,k,2,0,"div",13),f.YNc(20,q,2,0,"div",13),f.YNc(21,I,2,0,"div",13),f.YNc(22,A,2,0,"div",14),f.qZA(),f.qZA()}if(2&t){const t=n.$implicit;f.Q6J("ngStyle",f.VKq(22,T,n.index%2==0?"#f1f1f1":"white")),f.xp6(3),f.AsE(" ",f.lcZ(4,14,t.created)," ",f.xi3(5,16,t.created,"shortTime")," "),f.xp6(5),f.hij(" ",null==t.vendorId?null:t.vendorId.company," "),f.xp6(3),f.hij(" ",f.xi3(12,19,t.dateLivraison,"shortTime")," "),f.xp6(3),f.Q6J("ngIf",!t.vendorConfirm&&!t.orderConfirm&&1==t.status),f.xp6(1),f.Q6J("ngIf",t.orderConfirm&&1==t.status),f.xp6(1),f.Q6J("ngIf",t.vendorConfirm&&2==t.status),f.xp6(1),f.Q6J("ngIf",t.vendorConfirm&&3==t.status),f.xp6(1),f.Q6J("ngIf",t.vendorConfirm&&4==t.status),f.xp6(1),f.Q6J("ngIf",t.paid&&!t.delivered&&5==t.status),f.xp6(1),f.Q6J("ngIf",t.paid&&!t.delivered&&3==t.status),f.xp6(1),f.Q6J("ngIf",t.paid&&t.delivered),f.xp6(1),f.Q6J("ngIf",!t.vendorConfirm&&0==t.status)}}const w=[{path:"",component:(()=>{class t{constructor(t,n,e,o,i,r,c,l){this.vendorService=t,this.modalController=n,this.router=e,this.urlService=o,this.notif=i,this.restApiService=r,this.adminService=c,this.countItemsService=l,this.commandeList=[],console.log("hello"),this.takeUrl()}ngOnInit(){}takeUrl(){this.urlService.getUrl().subscribe(t=>{this.url=t,console.log(t),this.getOrder()})}getOrder(){let t=localStorage.getItem("adminId");console.log(t),this.adminId=t,this.webServerSocket(t),this.vendorService.retailerGetOrders(t).subscribe(t=>{console.log(t),this.commandeList=t})}presentModal(t){return(0,l.mG)(this,void 0,void 0,function*(){t.adminId=this.adminId,this.vendorService.setOrder(t),this.router.navigateByUrl("vendor-modal")})}webServerSocket(t){console.log(t),console.log(this.url),this.sockets=a()(this.url),this.sockets.on(`${t}RetailerConfirmOrder`,t=>(0,l.mG)(this,void 0,void 0,function*(){console.log(t);let n=this.commandeList.findIndex(n=>n._id==t._id);n>=0&&(t.vendorId=this.commandeList[n].vendorId,this.commandeList.splice(n,1,t))}))}addToStock(t){return(0,l.mG)(this,void 0,void 0,function*(){let n=0,e=0,o=[];o=t,console.log(o),o.forEach(t=>{t.qty&&(n+=t.qty),t.coast&&(e+=parseInt(t.coast))}),console.log(e);let i=[],r=[],c=[];for(let t=0;t<o.length;t++){let n={};console.log(o[t]),n=o[t].item.nbrBtl?{newquantity:o[t].qty+o[t].item.nbrBtl,id:o[t].item._id}:{newquantity:o[t].qty,id:o[t].item._id},o[t].item.productType&&"manufacturedItems"==o[t].item.productType&&c.push(n),o[t].item.productType?i.push(n):(console.log("pack here"),o[t].item.newquantity=o[t].qty,r.push(o[t]))}console.log(r),r.length&&(yield this.sendPackToServer(r,i)),c.length&&(yield this.sendProductRestoToServer(c));let l=yield{articles:t,quantity:n,totalPrice:e};this.adminService.sendPurchase(l).subscribe(t=>{console.log("end of all")})})}sendPackToServer(t,n){return new Promise((e,o)=>{this.countItemsService.countProductsItems(t).then(o=>{o.length&&this.restApiService.updateMorePackItem({tab:o,fromVendor:!0}).subscribe(i=>{o.forEach(t=>{console.log(t);let e={newquantity:parseInt(t.newquantity),id:t.productItemId,noRistourne:t.noRistourne,maeriId:t.maeriId};n.push(e)}),console.log(t),console.log(n),this.restApiService.updateMoreProductItem({tab:n,fromVendor:!0}).subscribe(t=>{e("ok")})})})})}sendProductRestoToServer(t){return new Promise((n,e)=>{console.log("send resto init---++++ ok");let o=0,i=t.length;t.length&&(0,g.$R)((0,d.D)(t),(0,p.F)(500)).pipe((0,u.U)(([t])=>t)).subscribe(t=>{console.log("send resto 2 ok"),this.EnvoiManufactured(t),o+=1,o>=i&&setTimeout(()=>{console.log("cest bon=======++++++++112222----"),n("ok")},200)})})}EnvoiManufactured(t){this.restApiService.updateManufacturedItem(t).subscribe(t=>{console.log(t)})}}return t.\u0275fac=function(n){return new(n||t)(f.Y36(x.A),f.Y36(r.IN),f.Y36(c.F0),f.Y36(m.i),f.Y36(h.g),f.Y36(_.e),f.Y36(C.l),f.Y36(P.w))},t.\u0275cmp=f.Xpm({type:t,selectors:[["app-retailer-order"]],decls:24,vars:2,consts:[["slot","start"],["defaultHref","/start"],[1,"ion-align-self-center",3,"ngClass"],[1,"ion-text-center","ion-text-uppercase"],["color","primary"],["size-sm","3","size-md","3","size-xm","3","size-lm","3","size-lg","3",1,"ion-align-self-center"],[1,"ion-text-center","ion-text-uppercase","taille"],["color","primary",3,"ngStyle","click",4,"ngFor","ngForOf"],["color","primary",3,"ngStyle","click"],["class","ion-text-center ion-text-uppercase taille color1",4,"ngIf"],["class","ion-text-center ion-text-uppercase taille color4",4,"ngIf"],["class","ion-text-center ion-text-uppercase taille color2",4,"ngIf"],["class","ion-text-center ion-text-uppercase taille color3",4,"ngIf"],["class","ion-text-center",4,"ngIf"],["class","ion-text-center ion-text-uppercase taille color0",4,"ngIf"],[1,"ion-text-center","ion-text-uppercase","taille","color1"],[1,"ion-text-center","ion-text-uppercase","taille","color4"],[1,"ion-text-center","ion-text-uppercase","taille","color2"],[1,"ion-text-center","ion-text-uppercase","taille","color3"],[1,"ion-text-center"],[1,"ion-text-center","ion-text-uppercase","taille","color0"]],template:function(t,n){1&t&&(f.TgZ(0,"ion-header"),f.TgZ(1,"ion-toolbar"),f.TgZ(2,"ion-buttons",0),f._UZ(3,"ion-back-button",1),f.qZA(),f.qZA(),f.qZA(),f.TgZ(4,"ion-content"),f.TgZ(5,"ion-row"),f.TgZ(6,"ion-col",2),f.TgZ(7,"div",3),f.TgZ(8,"h3"),f._uU(9,"les commandes"),f.qZA(),f.qZA(),f.qZA(),f.qZA(),f.TgZ(10,"ion-row",4),f.TgZ(11,"ion-col",5),f.TgZ(12,"div",6),f._uU(13,"Journ\xe9\xe9"),f.qZA(),f.qZA(),f.TgZ(14,"ion-col",5),f.TgZ(15,"div",6),f._uU(16,"company"),f.qZA(),f.qZA(),f.TgZ(17,"ion-col",5),f.TgZ(18,"div",6),f._uU(19," heure livraison "),f.qZA(),f.qZA(),f.TgZ(20,"ion-col",5),f.TgZ(21,"div",6),f._uU(22,"statut"),f.qZA(),f.qZA(),f.qZA(),f.YNc(23,y,23,24,"ion-row",7),f.qZA()),2&t&&(f.xp6(6),f.Q6J("ngClass","separationBlock"),f.xp6(17),f.Q6J("ngForOf",n.commandeList))},directives:[r.Gu,r.sr,r.Sm,r.oU,r.cs,r.W2,r.Nd,r.wI,o.mk,o.sg,o.PC,o.O5],pipes:[o.uU],styles:["ion-toolbar[_ngcontent-%COMP%]{background:--ion-color-primary}.lesbtn[_ngcontent-%COMP%]{flex-wrap:wrap}.circle[_ngcontent-%COMP%], .lesbtn[_ngcontent-%COMP%]{display:flex}.circle1[_ngcontent-%COMP%]{text-align:center}.circle1[_ngcontent-%COMP%], .circle2[_ngcontent-%COMP%]{width:80%;height:80%}.circle-progress[_ngcontent-%COMP%]{font-size:25px;position:relative;top:25%}.lesbtn2[_ngcontent-%COMP%]{font-size:50%;text-transform:uppercase}.shopbtn[_ngcontent-%COMP%]{position:relative;left:8px}.col[_ngcontent-%COMP%]{align-self:center}ion-badge[_ngcontent-%COMP%]{color:#fff;position:absolute;top:0;right:0;border-radius:100%}.label[_ngcontent-%COMP%]{font-size:70%}.imgavatar[_ngcontent-%COMP%]{width:30px;height:30px}.category-block[_ngcontent-%COMP%]{margin-bottom:4px}.category-banner[_ngcontent-%COMP%]{border-left:8px solid var(--ion-color-secondary);background:var(--ion-color-light);height:40px;padding:10px;font-weight:500}.allChart[_ngcontent-%COMP%], .allChart2[_ngcontent-%COMP%], .allChart3[_ngcontent-%COMP%]{background-color:#000}.flex-container[_ngcontent-%COMP%]{display:flex;align-items:stretch;background-color:#f1f1f1}.flex-container[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{width:100px;margin:10px;text-align:center;height:75px;font-size:10px;padding-top:10%;text-transform:uppercase}.flex-container[_ngcontent-%COMP%] > .div1[_ngcontent-%COMP%]{border:1px solid #f7ab1e}.flex-container[_ngcontent-%COMP%] > .div2[_ngcontent-%COMP%]{border:1px solid #1ef7f7}.flex-container[_ngcontent-%COMP%] > .div3[_ngcontent-%COMP%]{border:1px solid #6a1ef7}.flex-container[_ngcontent-%COMP%] > .div4[_ngcontent-%COMP%]{border:1px solid #f71ee5}.titleInDiv[_ngcontent-%COMP%]{text-align:center;font-size:7px;margin:0}.numberInDiv[_ngcontent-%COMP%]{text-align:center;font-weight:700;font-size:15px}.numberIntable[_ngcontent-%COMP%]{border:none;padding:10px;font-size:10px}.numberIntable[_ngcontent-%COMP%], .textRight[_ngcontent-%COMP%]{text-align:right}.textLeft[_ngcontent-%COMP%]{text-align:left}.textCenter[_ngcontent-%COMP%]{text-align:center}.table[_ngcontent-%COMP%], .table1[_ngcontent-%COMP%]{border:none}.table[_ngcontent-%COMP%]{padding:0}.productname[_ngcontent-%COMP%]{text-align:left;border:none;padding:10px;font-size:10px;color:#269af8}.resume[_ngcontent-%COMP%]{margin-top:15%}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#f1f1f1}th[_ngcontent-%COMP%]{border:none}.ionItem[_ngcontent-%COMP%]{width:100px;background-color:#000}div[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:11px;font-weight:700}ion-col[_ngcontent-%COMP%]{border:1px solid #f1f1f1}.header-row[_ngcontent-%COMP%]{padding-top:10px;padding-bottom:10px}.header-row[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:13px}.divResto[_ngcontent-%COMP%]{margin-top:100px}.alertStock[_ngcontent-%COMP%]{color:red;font-size:18px}.separationBlock[_ngcontent-%COMP%]{background-color:#494848;color:#fff;padding:15px;margin-top:15px}.desktop[_ngcontent-%COMP%]   ion-router-outlet[_ngcontent-%COMP%]{margin-top:56px;margin-bottom:56px}.desktop[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{max-height:40px}.desktop[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background:#374168}.desktop[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]{--color:var(--ion-color-light)}.desktop[_ngcontent-%COMP%]   .active-link[_ngcontent-%COMP%]{--color:var(--ion-color-primary)}.footer[_ngcontent-%COMP%]{width:100%;color:#fff;font-weight:700;background:#374168;height:56px;line-height:56px;text-align:center;position:fixed;bottom:0}.btnfooter[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{color:#494848;font-size:11px}ion-button[_ngcontent-%COMP%]   .btnmenu[_ngcontent-%COMP%], ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-flow:column nowrap;align-items:center}ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.btnfooter2[_ngcontent-%COMP%]{color:#494848;font-size:11px;font-weight:bolder}ion-col[_ngcontent-%COMP%]   .inte[_ngcontent-%COMP%]{font-size:9px}.second-lastrow[_ngcontent-%COMP%]{background-color:#ebbd40;padding-top:10px;padding-bottom:10px}.last-row[_ngcontent-%COMP%]{padding-top:1px;padding-bottom:1px}.lastBtn[_ngcontent-%COMP%]{background-color:#16f08a;padding-top:10px;padding-bottom:10px}.color1[_ngcontent-%COMP%]{color:#424141}.color2[_ngcontent-%COMP%]{color:#06d65d;font-size:8px}.color3[_ngcontent-%COMP%]{color:#4bf04b}.color4[_ngcontent-%COMP%]{color:#6372f5}.color0[_ngcontent-%COMP%]{color:#fd5656}"]}),t})()}];let S=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=f.oAB({type:t}),t.\u0275inj=f.cJS({imports:[[c.Bz.forChild(w)],c.Bz]}),t})(),U=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=f.oAB({type:t}),t.\u0275inj=f.cJS({imports:[[o.ez,i.u5,r.Pc,S]]}),t})()}}]);