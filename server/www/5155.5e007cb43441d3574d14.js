(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[5155],{5155:(t,e,i)=>{"use strict";i.r(e),i.d(e,{FcHomePageModule:()=>A});var o=i(1511),s=i(6073),n=i(8158),r=i(8777),c=i(4762),l=i(1344),d=i.n(l),a=i(5416),g=i(5959),m=i(994),h=i(1572),u=i(5946),p=i(2874),f=i(4375),Z=i(2185),v=i(4144),C=i(2968),S=i(2181),_=i(1094),x=i(7149);const y=function(t){return{"background-color":t}},b=function(t){return[t," ","symbol","3.0-0","fr"]};function T(t,e){if(1&t){const t=h.EpF();h.TgZ(0,"ion-row",11),h.TgZ(1,"ion-col",12),h.NdJ("click",function(){h.CHM(t);const i=e.$implicit,o=e.index;return h.oxw().displayBill(i,o)}),h.TgZ(2,"div",13),h._uU(3),h.ALo(4,"date"),h.qZA(),h.qZA(),h.TgZ(5,"ion-col",12),h.NdJ("click",function(){h.CHM(t);const i=e.$implicit,o=e.index;return h.oxw().displayBill(i,o)}),h.TgZ(6,"div",13),h._uU(7),h.qZA(),h.qZA(),h.TgZ(8,"ion-col",12),h.NdJ("click",function(){h.CHM(t);const i=e.$implicit,o=e.index;return h.oxw().displayBill(i,o)}),h.TgZ(9,"div",13),h._uU(10),h.qZA(),h.qZA(),h.TgZ(11,"ion-col",14),h.NdJ("click",function(){h.CHM(t);const i=e.$implicit,o=e.index;return h.oxw().displayBill(i,o)}),h.TgZ(12,"div",13),h._uU(13),h.ALo(14,"currency"),h.qZA(),h.qZA(),h.TgZ(15,"ion-col",9),h._UZ(16,"div",13),h.qZA(),h.TgZ(17,"ion-col",15),h._UZ(18,"div",13),h.qZA(),h.TgZ(19,"ion-col",15),h._UZ(20,"div",13),h.qZA(),h.qZA()}if(2&t){const t=e.$implicit;h.Q6J("ngStyle",h.VKq(16,y,e.index%2==0?"#f1f1f1":"white")),h.xp6(3),h.hij(" ",h.xi3(4,7,t.created,"short")," "),h.xp6(4),h.hij(" ",t.numFacture," "),h.xp6(3),h.hij(" ",t.customer?t.customer.name:"No Name"," "),h.xp6(3),h.hij(" ",h.G7q(14,10,h.VKq(18,b,t.montantReduction?t.montantReduction+t.taxeRetrait+t.phytosanitaire+t.transport+t.transport_colis:t.commande.cartdetails.totalPrice+t.taxeRetrait+t.phytosanitaire+t.transport+t.transport_colis))," "),h.xp6(4),h.Q6J("ngStyle",h.VKq(20,y,t.scConfirm?"var(--ion-color-success)":"white")),h.xp6(2),h.Q6J("ngStyle",h.VKq(22,y,t.scConfirm&&!t.swConfirm?"var(--ion-color-warning)":t.scConfirm&&t.swConfirm?"var(--ion-color-success)":"white"))}}const w=[{path:"",component:(()=>{class t{constructor(t,e,i,o,s,n,r,c,l,d,a,m){this.menu=t,this.adminService=e,this.notifi=i,this.random=o,this.swService=s,this.restApiService=n,this.router=r,this.urlService=c,this.authService=l,this.modalController=d,this.cacheService=a,this.networkService=m,this.billTab=[],this.EmployesList=[],this.destroy$=new g.xQ,this.orders=[],this.randomId="",this.customerList=[]}ngOnInit(){this.getSetting(),this.takeEmployees()}ionViewDidEnter(){this.menu.enable(!0,"first"),this.getCustomerBill(),this.getOrders(),this.takeUrl()}ionViewWillLeave(){this.sockets.connected=!1,this.sockets.disconnected=!0,this.adminId=null,this.url=null}goToShop(){this.router.navigateByUrl("sc-shop")}takeUrl(){this.urlService.getUrl().pipe((0,a.R)(this.destroy$)).subscribe(t=>{console.log("url ici===",t),this.url=t,this.adminId=localStorage.getItem("adminId"),this.webServerSocket()})}webServerSocket(){let t=this.random.getStoreId();this.sockets=d()(this.url),this.sockets.on("connect",function(){console.log("je suis connect\xe9 socket",this.url)}),this.sockets.on(`${this.adminId}billUpdate`,t=>{let e=this.orders.findIndex(e=>e._id==t._id);e>=0&&0==t.caisseConfirm&&this.orders.splice(e,1,t)}),this.sockets.on(`${this.adminId}${t}newOrder`,t=>{if(t.customerId){let e=this.customerList.find(e=>e._id==t.customerId);e&&(t.customer=e),this.orders.unshift(t)}else this.orders.unshift(t)}),this.sockets.on(`${this.adminId}saConfirm`,t=>{let e=this.orders.findIndex(e=>e._id==t._id);e>=0&&1==t.caisseConfirm&&this.orders.splice(e,1)}),this.sockets.on(`${this.adminId}swConfirm`,t=>{let e=this.orders.findIndex(e=>e._id==t._id);e>=0&&1==t.caisseConfirm&&this.orders.splice(e,1)}),this.sockets.on(`${this.adminId}${t}invoiceCancel`,t=>{this.orders=this.orders.filter(e=>e._id!==t._id)})}getSetting(){this.adminService.getCompanySetting().subscribe(t=>{if(t.company.length){let e=t.company[0];this.random.setSetting(e),localStorage.setItem("setting",JSON.stringify(t.company)),localStorage.setItem("useResource",JSON.stringify(e.use_resource)),localStorage.setItem("manageStockWithService",JSON.stringify(e.manageStockWithService)),localStorage.setItem("poslive",JSON.stringify(e.use_pos_live))}},t=>{console.log(t)})}getCustomerBill(){this.adminService.getBill().subscribe(t=>{console.log("bill here",t),this.billTab=t.docs.filter(t=>1==t.scConfirm&&0==t.swConfirm)})}takeEmployees(){this.authService.getEmployees().subscribe(t=>{console.log("voici les emplo===>",t),this.EmployesList=t.employes,this.EmployesList=this.EmployesList.sort((t,e)=>t.name>e.name?1:-1),this.random.setEmployeList(this.EmployesList)})}getOrders(){return(0,c.mG)(this,void 0,void 0,function*(){JSON.parse(localStorage.getItem("user")),JSON.parse(localStorage.getItem("user")),this.adminService.getInvoiceNotPaieAdmin2(1).pipe((0,a.R)(this.destroy$)).subscribe(t=>(0,c.mG)(this,void 0,void 0,function*(){console.log("voici les invoices===>",t),this.getMyCustomer(),this.orders=t.filter(t=>1==t.scConfirm&&0==t.caisseConfirm)}),t=>{})})}deleteBill(t,e){console.log(t)}displayBill(t,e){return(0,c.mG)(this,void 0,void 0,function*(){console.log(t);const e=yield this.modalController.create({component:m.k,componentProps:{order:t,order2:t,Pos:!1},backdropDismiss:!1});return e.onDidDismiss().then(e=>(0,c.mG)(this,void 0,void 0,function*(){if("cancel invoice"===e.data&&setTimeout(()=>(0,c.mG)(this,void 0,void 0,function*(){this.orders=(void 0).filter(e=>e.localId!==t.localId),this.orders=this.orders.sort((t,e)=>new Date(t.created).getTime()-new Date(e.created).getTime()>0?-1:1)}),1e3),"no_update"!==e.data&&("ok ok"===e.data.status&&(this.randomId=t.localId,this.restoreData(t)),"partially paie"===e.data)){let e=this.orders.findIndex(e=>e.localId===t.localId);e>=0&&this.orders.splice(e,1,t)}})),yield e.present()})}restoreData(t){setTimeout(()=>(0,c.mG)(this,void 0,void 0,function*(){this.orders=this.orders.filter(e=>e.localId!==t.localId),this.orders=this.orders.sort((t,e)=>new Date(t.created).getTime()-new Date(e.created).getTime()>0?-1:1)}),1500)}getMyCustomer(){this.adminService.getUserCustumer().subscribe(t=>{this.customerList=t.custumers,console.log("voici les clients"),this.orders.forEach(t=>{let e=this.customerList.find(e=>e._id==t.customerId);e&&(t.customer=e)})})}}return t.\u0275fac=function(e){return new(e||t)(h.Y36(n._q),h.Y36(u.l),h.Y36(p.g),h.Y36(f.i),h.Y36(Z.f),h.Y36(v.e),h.Y36(r.F0),h.Y36(C.i),h.Y36(S.u),h.Y36(n.IN),h.Y36(_.$),h.Y36(x.S))},t.\u0275cmp=h.Xpm({type:t,selectors:[["app-fc-home"]],decls:34,vars:1,consts:[["slot","end"],["fill","outline",3,"click"],[2,"font-size","14px","font-weight","bold"],["size","12"],[1,"ion-text-center","ion-text-uppercase"],[1,"header-component"],["size-sm","2","size-md","2","size-lg","2"],[1,"ion-text-center"],["size-sm","3","size-md","3","size-lg","3"],["size-sm","1","size-md","1","size-lg","1"],["class","data-row data-update","style","font-size: 11px",3,"ngStyle",4,"ngFor","ngForOf"],[1,"data-row","data-update",2,"font-size","11px",3,"ngStyle"],["size-sm","2","size-md","2","size-lg","2",3,"click"],[1,"ion-text-center","ion-text-uppercase","smallSize"],["size-sm","3","size-md","3","size-lg","3",3,"click"],["size-sm","1","size-md","1","size-lg","1",3,"ngStyle"]],template:function(t,e){1&t&&(h.TgZ(0,"ion-header"),h.TgZ(1,"ion-toolbar"),h._UZ(2,"ion-title"),h.TgZ(3,"ion-buttons",0),h.TgZ(4,"ion-button",1),h.NdJ("click",function(){return e.goToShop()}),h._uU(5,"vente directe"),h.qZA(),h.TgZ(6,"ion-button",1),h.NdJ("click",function(){return e.getOrders()}),h._uU(7," Rafraichir "),h.qZA(),h.qZA(),h.qZA(),h.qZA(),h.TgZ(8,"ion-content"),h.TgZ(9,"ion-grid"),h.TgZ(10,"ion-row",2),h.TgZ(11,"ion-col",3),h.TgZ(12,"div",4),h.TgZ(13,"p"),h._uU(14,"Commandes clients"),h.qZA(),h.qZA(),h.qZA(),h.qZA(),h.TgZ(15,"ion-row",5),h.TgZ(16,"ion-col",6),h.TgZ(17,"div",7),h._uU(18,"Date"),h.qZA(),h.qZA(),h.TgZ(19,"ion-col",6),h.TgZ(20,"div",7),h._uU(21,"Num\xe9ro"),h.qZA(),h.qZA(),h.TgZ(22,"ion-col",6),h.TgZ(23,"div",7),h._uU(24,"Client"),h.qZA(),h.qZA(),h.TgZ(25,"ion-col",8),h.TgZ(26,"div",7),h._uU(27,"Montant"),h.qZA(),h.qZA(),h.TgZ(28,"ion-col",9),h._UZ(29,"div",7),h.qZA(),h.TgZ(30,"ion-col",6),h.TgZ(31,"div",7),h._uU(32,"status"),h.qZA(),h.qZA(),h.qZA(),h.YNc(33,T,21,24,"ion-row",10),h.qZA(),h.qZA()),2&t&&(h.xp6(33),h.Q6J("ngForOf",e.orders))},directives:[n.Gu,n.sr,n.wd,n.Sm,n.YG,n.W2,n.jY,n.Nd,n.wI,o.sg,o.PC],pipes:[o.uU,o.H9],styles:[".invoices[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%], ion-item[_ngcontent-%COMP%]{--background:#0000}.invoices[_ngcontent-%COMP%]{background-color:#ff0}table[_ngcontent-%COMP%]{font-family:arial,sans-serif;border-collapse:collapse;width:100%;margin-bottom:5%}.divtable[_ngcontent-%COMP%]{width:100%;padding-bottom:20px}td[_ngcontent-%COMP%], th[_ngcontent-%COMP%]{border:1px solid #ddd;text-align:center;padding:4px;font-size:11px}tr[_ngcontent-%COMP%]{background-color:#fff;width:100%}tr[_ngcontent-%COMP%]:nth-child(2n){background-color:#ddd}.otherrows[_ngcontent-%COMP%] > td[_ngcontent-%COMP%]{height:5px;border:1px solid #0c0c0ce8;text-align:center;padding-left:8px;padding-right:8px;font-size:8px}.title[_ngcontent-%COMP%]{text-align:center;text-transform:uppercase}@media (min-width:800px){tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{font-size:14px}.btnStatus[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{text-align:center}.btnStatus[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:20px}}"]}),t})()}];let k=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=h.oAB({type:t}),t.\u0275inj=h.cJS({imports:[[r.Bz.forChild(w)],r.Bz]}),t})();var q=i(1064);let A=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=h.oAB({type:t}),t.\u0275inj=h.cJS({imports:[[o.ez,s.u5,n.Pc,k,q.aw.forChild()]]}),t})()}}]);