(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[3819],{3819:(e,t,i)=>{"use strict";i.r(t),i.d(t,{SwCommandesPageModule:()=>U});var o=i(1511),n=i(6073),s=i(8158),c=i(8777),r=i(4762),a=i(1344),l=i.n(a),d=i(5416),g=i(5959),u=i(1572),h=i(5946),m=i(2874),Z=i(4375),p=i(2185),f=i(4144),v=i(2968);function A(e,t){if(1&e){const e=u.EpF();u.TgZ(0,"ion-button",5),u.NdJ("click",function(){return u.CHM(e),u.oxw().router.navigateByUrl("procurment-product-item")}),u._UZ(1,"ion-icon",6),u.TgZ(2,"ion-badge",7),u._uU(3),u.qZA(),u.qZA()}if(2&e){const e=u.oxw();u.xp6(3),u.hij("",e.transaction.length," ")}}const q=function(e){return{"background-color":e}};function T(e,t){if(1&e){const e=u.EpF();u.TgZ(0,"ion-row",12),u.NdJ("click",function(){u.CHM(e);const i=t.$implicit,o=t.index;return u.oxw(2).display(i,o)}),u.TgZ(1,"ion-col",9),u.TgZ(2,"div",13),u._uU(3),u.ALo(4,"date"),u.qZA(),u.qZA(),u.TgZ(5,"ion-col",9),u.TgZ(6,"div",13),u._uU(7),u.qZA(),u.qZA(),u.TgZ(8,"ion-col",9),u.TgZ(9,"div",13),u._uU(10),u.qZA(),u.qZA(),u.TgZ(11,"ion-col",14),u._UZ(12,"div",13),u.qZA(),u.TgZ(13,"ion-col",14),u._UZ(14,"div",13),u.qZA(),u.TgZ(15,"ion-col",14),u._UZ(16,"div",13),u.qZA(),u.qZA()}if(2&e){const e=t.$implicit;u.Q6J("ngStyle",u.VKq(10,q,t.index%2==0?"#f1f1f1":"white")),u.xp6(3),u.hij(" ",u.xi3(4,7,e.created,"short")," "),u.xp6(4),u.hij(" ",e.store.name," "),u.xp6(3),u.hij(" ",e.quantity," "),u.xp6(1),u.Q6J("ngStyle",u.VKq(12,q,e.scConfirm?"var(--ion-color-success)":"white")),u.xp6(2),u.Q6J("ngStyle",u.VKq(14,q,e.saConfirm?"var(--ion-color-success)":"white")),u.xp6(2),u.Q6J("ngStyle",u.VKq(16,q,e.managerConfirm?"var(--ion-color-success)":"white"))}}function w(e,t){if(1&e&&(u.TgZ(0,"ion-grid"),u.TgZ(1,"ion-row",8),u.TgZ(2,"ion-col",9),u.TgZ(3,"div",10),u._uU(4,"Date"),u.qZA(),u.qZA(),u.TgZ(5,"ion-col",9),u.TgZ(6,"div",10),u._uU(7,"Agence"),u.qZA(),u.qZA(),u.TgZ(8,"ion-col",9),u.TgZ(9,"div",10),u._uU(10,"Quantit\xe9"),u.qZA(),u.qZA(),u.TgZ(11,"ion-col",9),u.TgZ(12,"div",10),u._uU(13,"Sc"),u.qZA(),u.qZA(),u.TgZ(14,"ion-col",9),u.TgZ(15,"div",10),u._uU(16,"Dg"),u.qZA(),u.qZA(),u.TgZ(17,"ion-col",9),u.TgZ(18,"div",10),u._uU(19,"Ag"),u.qZA(),u.qZA(),u.qZA(),u.YNc(20,T,17,18,"ion-row",11),u.qZA()),2&e){const e=u.oxw();u.xp6(20),u.Q6J("ngForOf",e.agencesCommandes)}}function S(e,t){1&e&&(u.TgZ(0,"div",15),u.TgZ(1,"p"),u._uU(2,"Pas de commandes disponibles pour le moment"),u.qZA(),u.qZA())}const b=[{path:"",component:(()=>{class e{constructor(e,t,i,o,n,s,c,r){this.menu=e,this.adminService=t,this.notifi=i,this.random=o,this.swService=n,this.restApiService=s,this.router=c,this.urlService=r,this.articles=[],this.agencesCommandes=[],this.productServiceTab=[],this.destroy$=new g.xQ,this.transaction=[]}ngOnInit(){this.takeProductServiceList(),this.takeUrl()}ionViewDidEnter(){this.menu.enable(!0,"first"),this.getPurchase()}takeUrl(){this.urlService.getUrl().pipe((0,d.R)(this.destroy$)).subscribe(e=>{console.log("url ici===",e),this.url=e,this.adminId=localStorage.getItem("adminId"),this.webServerSocket(this.adminId,e)})}getPurchase(){this.notifi.presentLoading(),this.random.getStoreId();let e=JSON.parse(localStorage.getItem("roles"));this.adminService.getPurchase().subscribe(t=>{this.allPurchase=e.includes(7)?t.docs.filter(e=>1==e.scConfirm&&0==e.swConfirm):t.docs,this.stores=this.random.getStoreList(),this.allPurchase.forEach(e=>{let t=this.stores.find(t=>t.id==e.storeId);e.store=t}),console.log(this.allPurchase),this.agencesCommandes=this.allPurchase,this.notifi.dismissLoading()})}display(e,t){this.notifi.presentLoading();let i=[];e.articles[0].products.forEach(e=>{let t=this.productServiceTab.find(t=>t.idList.includes(e.item._id));t&&i.push({avaible:t,request:e,accept:0,reject:0})}),setTimeout(()=>{this.notifi.dismissLoading(),console.log("match ==>",i),this.random.setAgenceCommande(i),this.random.setData(e),this.router.navigateByUrl("sw-display-commande")},1e3)}takeProductServiceList(){this.restApiService.getBillardList().subscribe(e=>(0,r.mG)(this,void 0,void 0,function*(){let t=e.product.sort((e,t)=>e.name.toLocaleLowerCase()>t.name.toLocaleLowerCase()?1:e.name.toLocaleLowerCase()<t.name.toLocaleLowerCase()?-1:0);t=e.product,console.log("=====>",t),this.productServiceTab=t}))}webServerSocket(e,t){this.sockets=l()(t),this.sockets.on("connect",function(){console.log("je suis connect\xe9 socket",t)});let i=this.random.getStoreId();console.log("storeId",i),this.sockets.on(`${this.adminId}warehouseChange`,e=>{console.log(e);let t=this.agencesCommandes.findIndex(t=>t._id==e._id);t>=0&&(this.agencesCommandes.splice(t,1,e),this.transaction.push(e),this.notifi.presentToast("you have new notification","danger"))}),this.sockets.on(`${this.adminId}${i}billardItem`,e=>{console.log(e);let t=this.productServiceTab.findIndex(t=>t._id==e._id);t>=0&&this.productServiceTab.splice(t,1,e)})}}return e.\u0275fac=function(t){return new(t||e)(u.Y36(s._q),u.Y36(h.l),u.Y36(m.g),u.Y36(Z.i),u.Y36(p.f),u.Y36(f.e),u.Y36(c.F0),u.Y36(v.i))},e.\u0275cmp=u.Xpm({type:e,selectors:[["app-sw-commandes"]],decls:10,vars:3,consts:[["slot","start"],["defaultHref","/start"],[3,"click",4,"ngIf"],[4,"ngIf"],["style","text-align: center; height: 100%",4,"ngIf"],[3,"click"],["name","notifications-outline"],["id","notifications-badge","color","danger"],[1,"header-component"],["size-sm","2","size-md","2","size-lg","2"],[1,"ion-text-center"],["class","data-row data-update",3,"ngStyle","click",4,"ngFor","ngForOf"],[1,"data-row","data-update",3,"ngStyle","click"],[1,"ion-text-center","ion-text-uppercase","smallSize"],["size-sm","2","size-md","2","size-lg","2",3,"ngStyle"],[2,"text-align","center","height","100%"]],template:function(e,t){1&e&&(u.TgZ(0,"ion-header"),u.TgZ(1,"ion-toolbar"),u.TgZ(2,"ion-title"),u._uU(3,"sw-commande"),u.qZA(),u.TgZ(4,"ion-buttons",0),u._UZ(5,"ion-back-button",1),u.YNc(6,A,4,1,"ion-button",2),u.qZA(),u.qZA(),u.qZA(),u.TgZ(7,"ion-content"),u.YNc(8,w,21,1,"ion-grid",3),u.YNc(9,S,3,0,"div",4),u.qZA()),2&e&&(u.xp6(6),u.Q6J("ngIf",t.transaction.length),u.xp6(2),u.Q6J("ngIf",t.agencesCommandes.length),u.xp6(1),u.Q6J("ngIf",0==t.agencesCommandes.length))},directives:[s.Gu,s.sr,s.wd,s.Sm,s.oU,s.cs,o.O5,s.W2,s.YG,s.gu,s.yp,s.jY,s.Nd,s.wI,o.sg,o.PC],pipes:[o.uU],styles:[""]}),e})()}];let x=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({imports:[[c.Bz.forChild(b)],c.Bz]}),e})();var C=i(1064);let U=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({imports:[[o.ez,n.u5,s.Pc,x,C.aw.forChild()]]}),e})()}}]);