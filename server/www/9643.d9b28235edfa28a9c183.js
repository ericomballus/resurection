(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[9643],{9643:(n,t,o)=>{"use strict";o.r(t),o.d(t,{RetailerDisplayOrderProposalPageModule:()=>b});var e=o(1511),i=o(6073),r=o(8158),c=o(8777),l=o(4762),s=o(1344),g=o.n(s),a=o(1572),d=o(3400),p=o(2874),f=o(2968);function u(n,t){if(1&n&&(a.TgZ(0,"div",6),a._uU(1),a.qZA()),2&n){const n=a.oxw().$implicit;a.xp6(1),a.hij(" ",n.vendorId.company," ")}}function x(n,t){if(1&n&&(a.TgZ(0,"div",6),a._uU(1),a.qZA()),2&n){const n=a.oxw().$implicit;a.xp6(1),a.hij(" ",n.retailerId.company," ")}}function m(n,t){if(1&n&&(a.TgZ(0,"div",15),a._uU(1),a.ALo(2,"currency"),a.qZA()),2&n){const n=a.oxw().$implicit;a.xp6(1),a.hij(" ",a.gM2(2,1,n.item.packPrice,"CFA","symbol","3.0-0")," ")}}function h(n,t){if(1&n&&(a.TgZ(0,"ion-row",20),a.TgZ(1,"ion-col",14),a.TgZ(2,"div",15),a._uU(3),a.qZA(),a.qZA(),a.TgZ(4,"ion-col",14),a.YNc(5,m,3,6,"div",19),a.qZA(),a.TgZ(6,"ion-col",14),a.TgZ(7,"div",15),a._uU(8),a.qZA(),a.qZA(),a.TgZ(9,"ion-col",14),a.TgZ(10,"div",15),a._uU(11),a.ALo(12,"currency"),a.qZA(),a.qZA(),a.qZA()),2&n){const n=t.$implicit;a.xp6(3),a.Oqu(n.item.name),a.xp6(2),a.Q6J("ngIf",n.item.packPrice),a.xp6(3),a.Oqu(n.qty),a.xp6(3),a.hij(" ",a.gM2(12,4,n.coast,"CFA","symbol","3.0-0")," ")}}function C(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"div",15),a.TgZ(1,"ion-button",21),a.NdJ("click",function(){a.CHM(n);const t=a.oxw(2).$implicit;return a.oxw(2).confirmOrders(t)}),a._uU(2," valider "),a.qZA(),a.qZA()}}function O(n,t){if(1&n&&(a.TgZ(0,"ion-col",12),a.TgZ(1,"ion-row",13),a.TgZ(2,"ion-col",14),a.TgZ(3,"div",15),a._uU(4,"name"),a.qZA(),a.qZA(),a.TgZ(5,"ion-col",14),a.TgZ(6,"div",15),a._uU(7,"price"),a.qZA(),a.qZA(),a.TgZ(8,"ion-col",14),a.TgZ(9,"div",15),a._uU(10,"Qty"),a.qZA(),a.qZA(),a.TgZ(11,"ion-col",14),a.TgZ(12,"div",15),a._uU(13,"T.price"),a.qZA(),a.qZA(),a.qZA(),a.YNc(14,h,13,9,"ion-row",16),a.TgZ(15,"ion-row",17),a.TgZ(16,"ion-col",18),a.YNc(17,C,3,0,"div",19),a.qZA(),a.qZA(),a.qZA()),2&n){const n=a.oxw().$implicit,t=a.oxw(2);a.xp6(14),a.Q6J("ngForOf",n.commandes),a.xp6(3),a.Q6J("ngIf",t.retailer)}}const _=function(n){return{"background-color":n}};function Z(n,t){if(1&n){const n=a.EpF();a.TgZ(0,"ion-row",9),a.NdJ("click",function(){a.CHM(n);const o=t.$implicit,e=t.index;return a.oxw(2).openOrder(o,e)}),a.TgZ(1,"ion-col",5),a.TgZ(2,"div",6),a._uU(3),a.ALo(4,"date"),a.ALo(5,"date"),a.qZA(),a.qZA(),a.TgZ(6,"ion-col",5),a.YNc(7,u,2,1,"div",10),a.YNc(8,x,2,1,"div",10),a.qZA(),a.TgZ(9,"ion-col",5),a.TgZ(10,"div",6),a._uU(11,"non livr\xe9"),a.qZA(),a.qZA(),a.YNc(12,O,18,2,"ion-col",11),a.qZA()}if(2&n){const n=t.$implicit,o=t.index,e=a.oxw(2);a.Q6J("ngStyle",a.VKq(11,_,o%2==0?"#f1f1f1":"white")),a.xp6(3),a.AsE(" ",a.lcZ(4,6,n.created)," ",a.xi3(5,8,n.created,"shortTime")," "),a.xp6(4),a.Q6J("ngIf",e.retailer),a.xp6(1),a.Q6J("ngIf",e.vendor),a.xp6(4),a.Q6J("ngIf",n.open)}}function P(n,t){if(1&n&&(a.TgZ(0,"div"),a.YNc(1,Z,13,13,"ion-row",8),a.qZA()),2&n){const n=a.oxw();a.xp6(1),a.Q6J("ngForOf",n.commandeList)}}const M=[{path:"",component:(()=>{class n{constructor(n,t,o,e,i){this.vendorService=n,this.loadingController=t,this.notif=o,this.router=e,this.urlService=i,this.retailer=!1,this.vendor=!1,this.isLoading=!1}ionViewWillEnter(){this.commandeList=this.vendorService.getProposalOrder(),this.commandeList[0].retailerId&&"string"==typeof this.commandeList[0].retailerId?(console.log("hello1"),this.retailer=!0,this.vendor=!1):(console.log("hello2"),this.retailer=!1,this.vendor=!0),this.takeUrl()}takeUrl(){console.log("url"),this.urlService.getUrl().subscribe(n=>{this.url=n;let t=localStorage.getItem("adminId");this.webServerSocket(t)})}ngOnInit(){}openOrder(n,t){this.vendorService.setProposalOrder2(n),this.router.navigateByUrl("retailer-modal")}displayOrders(){}confirmOrders(n){n.display=!1,n.retailerConfirm=!0,n[" vendorId"]=n.vendorId._id}presentLoading2(){return(0,l.mG)(this,void 0,void 0,function*(){return this.isLoading=!0,yield this.loadingController.create({duration:8e3,message:"please wait ..."}).then(n=>{n.present().then(()=>{this.isLoading||n.dismiss().then()})})})}dismissLoading(){return(0,l.mG)(this,void 0,void 0,function*(){return this.isLoading=!1,yield this.loadingController.dismiss().then()})}webServerSocket(n){this.sockets=g()(this.url),this.sockets.on(`${n}RetailerConfirmOrderProposal`,n=>(0,l.mG)(this,void 0,void 0,function*(){console.log(n),setTimeout(()=>{this.commandeList=this.vendorService.getProposalOrder(),this.commandeList[0].retailerId&&"string"==typeof this.commandeList[0].retailerId?(console.log("hello1"),this.retailer=!0,this.vendor=!1):(console.log("hello2"),this.retailer=!1,this.vendor=!0)},3e3),this.notif.presentToast("commande envoy\xe9!","success")}))}}return n.\u0275fac=function(t){return new(t||n)(a.Y36(d.A),a.Y36(r.HT),a.Y36(p.g),a.Y36(c.F0),a.Y36(f.i))},n.\u0275cmp=a.Xpm({type:n,selectors:[["app-retailer-display-order-proposal"]],decls:20,vars:2,consts:[["slot","start"],["defaultHref","/start"],["size-sm","12","size-md","12","size-xm","12","size-lg","12",1,"ion-align-self-center",3,"ngClass"],[1,"ion-text-center","ion-text-uppercase","taille",3,"click"],["color","primary"],["size-sm","4","size-md","4","size-xm","4","size-lm","4","size-lg","4",1,"ion-align-self-center"],[1,"ion-text-center","ion-text-uppercase","taille"],[4,"ngIf"],["color","primary",3,"ngStyle","click",4,"ngFor","ngForOf"],["color","primary",3,"ngStyle","click"],["class","ion-text-center ion-text-uppercase taille",4,"ngIf"],["size","12",4,"ngIf"],["size","12"],[1,"second-lastrow"],["size","3"],[1,"ion-text-center","inte"],["class","data-row data-update",4,"ngFor","ngForOf"],[1,"last-row"],[1,"ion-align-self-center"],["class","ion-text-center inte",4,"ngIf"],[1,"data-row","data-update"],["size","small",3,"click"]],template:function(n,t){1&n&&(a.TgZ(0,"ion-header"),a.TgZ(1,"ion-toolbar"),a.TgZ(2,"ion-buttons",0),a._UZ(3,"ion-back-button",1),a.qZA(),a.qZA(),a.qZA(),a.TgZ(4,"ion-content"),a.TgZ(5,"ion-row"),a.TgZ(6,"ion-col",2),a.TgZ(7,"div",3),a.NdJ("click",function(){return t.displayOrders()}),a._uU(8," proposition commandes "),a.qZA(),a.qZA(),a.qZA(),a.TgZ(9,"ion-row",4),a.TgZ(10,"ion-col",5),a.TgZ(11,"div",6),a._uU(12,"Journ\xe9\xe9"),a.qZA(),a.qZA(),a.TgZ(13,"ion-col",5),a.TgZ(14,"div",6),a._uU(15,"company"),a.qZA(),a.qZA(),a.TgZ(16,"ion-col",5),a.TgZ(17,"div",6),a._uU(18,"statut"),a.qZA(),a.qZA(),a.qZA(),a.YNc(19,P,2,1,"div",7),a.qZA()),2&n&&(a.xp6(6),a.Q6J("ngClass","separationBlock"),a.xp6(13),a.Q6J("ngIf",t.commandeList))},directives:[r.Gu,r.sr,r.Sm,r.oU,r.cs,r.W2,r.Nd,r.wI,e.mk,e.O5,e.sg,e.PC,r.YG],pipes:[e.uU,e.H9],styles:["ion-toolbar[_ngcontent-%COMP%]{background:--ion-color-primary}.lesbtn[_ngcontent-%COMP%]{flex-wrap:wrap}.circle[_ngcontent-%COMP%], .lesbtn[_ngcontent-%COMP%]{display:flex}.circle1[_ngcontent-%COMP%]{text-align:center}.circle1[_ngcontent-%COMP%], .circle2[_ngcontent-%COMP%]{width:80%;height:80%}.circle-progress[_ngcontent-%COMP%]{font-size:25px;position:relative;top:25%}.lesbtn2[_ngcontent-%COMP%]{font-size:50%;text-transform:uppercase}.shopbtn[_ngcontent-%COMP%]{position:relative;left:8px}.col[_ngcontent-%COMP%]{align-self:center}ion-badge[_ngcontent-%COMP%]{color:#fff;position:absolute;top:0;right:0;border-radius:100%}.label[_ngcontent-%COMP%]{font-size:70%}.imgavatar[_ngcontent-%COMP%]{width:30px;height:30px}.category-block[_ngcontent-%COMP%]{margin-bottom:4px}.category-banner[_ngcontent-%COMP%]{border-left:8px solid var(--ion-color-secondary);background:var(--ion-color-light);height:40px;padding:10px;font-weight:500}.allChart[_ngcontent-%COMP%], .allChart2[_ngcontent-%COMP%], .allChart3[_ngcontent-%COMP%]{background-color:#000}.flex-container[_ngcontent-%COMP%]{display:flex;align-items:stretch;background-color:#f1f1f1}.flex-container[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{width:100px;margin:10px;text-align:center;height:75px;font-size:10px;padding-top:10%;text-transform:uppercase}.flex-container[_ngcontent-%COMP%] > .div1[_ngcontent-%COMP%]{border:1px solid #f7ab1e}.flex-container[_ngcontent-%COMP%] > .div2[_ngcontent-%COMP%]{border:1px solid #1ef7f7}.flex-container[_ngcontent-%COMP%] > .div3[_ngcontent-%COMP%]{border:1px solid #6a1ef7}.flex-container[_ngcontent-%COMP%] > .div4[_ngcontent-%COMP%]{border:1px solid #f71ee5}.titleInDiv[_ngcontent-%COMP%]{text-align:center;font-size:7px;margin:0}.numberInDiv[_ngcontent-%COMP%]{text-align:center;font-weight:700;font-size:15px}.numberIntable[_ngcontent-%COMP%]{border:none;padding:10px;font-size:10px}.numberIntable[_ngcontent-%COMP%], .textRight[_ngcontent-%COMP%]{text-align:right}.textLeft[_ngcontent-%COMP%]{text-align:left}.textCenter[_ngcontent-%COMP%]{text-align:center}.table[_ngcontent-%COMP%], .table1[_ngcontent-%COMP%]{border:none}.table[_ngcontent-%COMP%]{padding:0}.productname[_ngcontent-%COMP%]{text-align:left;border:none;padding:10px;font-size:10px;color:#269af8}.resume[_ngcontent-%COMP%]{margin-top:15%}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#f1f1f1}th[_ngcontent-%COMP%]{border:none}.ionItem[_ngcontent-%COMP%]{width:100px;background-color:#000}div[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:11px;font-weight:700}ion-col[_ngcontent-%COMP%]{border:1px solid #f1f1f1}.header-row[_ngcontent-%COMP%]{padding-top:10px;padding-bottom:10px}.header-row[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:13px}.divResto[_ngcontent-%COMP%]{margin-top:100px}.alertStock[_ngcontent-%COMP%]{color:red;font-size:18px}.separationBlock[_ngcontent-%COMP%]{background-color:#494848;color:#fff;padding:15px;margin-top:15px}.desktop[_ngcontent-%COMP%]   ion-router-outlet[_ngcontent-%COMP%]{margin-top:56px;margin-bottom:56px}.desktop[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{max-height:40px}.desktop[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background:#374168}.desktop[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]{--color:var(--ion-color-light)}.desktop[_ngcontent-%COMP%]   .active-link[_ngcontent-%COMP%]{--color:var(--ion-color-primary)}.footer[_ngcontent-%COMP%]{width:100%;color:#fff;font-weight:700;background:#374168;height:56px;line-height:56px;text-align:center;position:fixed;bottom:0}.btnfooter[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]{color:#494848;font-size:11px}ion-button[_ngcontent-%COMP%]   .btnmenu[_ngcontent-%COMP%], ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;flex-flow:column nowrap;align-items:center}ion-button[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:15px}.btnfooter2[_ngcontent-%COMP%]{color:#494848;font-size:11px;font-weight:bolder}ion-col[_ngcontent-%COMP%]   .inte[_ngcontent-%COMP%]{font-size:9px}.second-lastrow[_ngcontent-%COMP%]{background-color:#ebbd40;padding-top:10px;padding-bottom:10px}.last-row[_ngcontent-%COMP%]{background-color:#ebbd40;padding-top:1px;padding-bottom:1px}"]}),n})()}];let v=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=a.oAB({type:n}),n.\u0275inj=a.cJS({imports:[[c.Bz.forChild(M)],c.Bz]}),n})(),b=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=a.oAB({type:n}),n.\u0275inj=a.cJS({imports:[[e.ez,i.u5,r.Pc,v]]}),n})()}}]);