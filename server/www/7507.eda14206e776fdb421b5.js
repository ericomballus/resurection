(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[7507],{7507:(t,e,o)=>{"use strict";o.r(e),o.d(e,{ProductItemListPageModule:()=>v});var i=o(1511),s=o(6073),n=o(8777),r=o(8158),c=o(1064),l=o(4762),a=o(691),d=o(1572),u=o(4144),p=o(731),m=o(4892);const g=function(){return["/product-buy"]};function h(t,e){1&t&&(d.TgZ(0,"ion-buttons",8),d.TgZ(1,"ion-button",9),d._UZ(2,"ion-icon",10),d.qZA(),d.qZA()),2&t&&(d.xp6(1),d.Q6J("routerLink",d.DdM(1,g)))}function f(t,e){if(1&t){const t=d.EpF();d.TgZ(0,"ion-item",11),d.TgZ(1,"ion-avatar",3),d._UZ(2,"img",13),d.qZA(),d.TgZ(3,"ion-label",14),d.TgZ(4,"p",15),d._uU(5),d.qZA(),d.TgZ(6,"p"),d._uU(7),d.qZA(),d.TgZ(8,"p"),d._uU(9),d.ALo(10,"translate"),d.ALo(11,"translate"),d.qZA(),d.qZA(),d.TgZ(12,"ion-button",16),d.NdJ("click",function(){d.CHM(t);const o=e.$implicit;return d.oxw(2).presentActionSheet(o)}),d._uU(13,"Reset"),d.qZA(),d.qZA()}if(2&t){const t=e.$implicit;d.xp6(2),d.s9C("src",t.url,d.LSH),d.xp6(3),d.Oqu(t.name),d.xp6(2),d.AsE("",t.purchasingPrice," -- ",t.sellingPrice,""),d.xp6(2),d.HOy(" ",d.lcZ(10,8,"MENU.in_stock"),": ",t.quantityItems," ",d.lcZ(11,10,"MENU.in_store"),": ",t.quantityStore," ")}}function Z(t,e){if(1&t&&(d.TgZ(0,"ion-list",11),d.YNc(1,f,14,12,"ion-item",12),d.qZA()),2&t){const t=d.oxw();d.xp6(1),d.Q6J("ngForOf",t.productsItem)}}function I(t,e){if(1&t&&(d.TgZ(0,"ion-card"),d._UZ(1,"img",13),d.TgZ(2,"ion-card-content"),d.TgZ(3,"p"),d._uU(4),d.qZA(),d.qZA(),d.qZA()),2&t){const t=d.oxw();d.xp6(1),d.s9C("src",t.dataItem.url,d.LSH),d.xp6(3),d.hij("Name: ",t.dataItem.name,"")}}function b(t,e){if(1&t){const t=d.EpF();d.TgZ(0,"form",17,18),d.NdJ("ngSubmit",function(){d.CHM(t);const e=d.MAs(1);return d.oxw().updateProd(e)}),d.TgZ(2,"ion-grid"),d.TgZ(3,"ion-row",19),d.TgZ(4,"ion-col",20),d.TgZ(5,"div",21),d.TgZ(6,"ion-item"),d.TgZ(7,"ion-label",22),d._uU(8,"Entrer le stock"),d.qZA(),d._UZ(9,"ion-input",23),d.qZA(),d.TgZ(10,"ion-item"),d.TgZ(11,"ion-label",22),d._uU(12,"description du produit"),d.qZA(),d._UZ(13,"ion-textarea",24),d.qZA(),d.qZA(),d.TgZ(14,"div",21),d.TgZ(15,"ion-button",25),d._uU(16,"Register"),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA()}if(2&t){const t=d.MAs(1);d.xp6(15),d.Q6J("disabled",t.invalid)}}const A=[{path:"",component:(()=>{class t{constructor(t,e,o,i,s,n,r,c){this.restApiService=t,this.modalController=e,this.alertController=o,this.actionSheetController=i,this.toastController=s,this.translateConfigService=n,this.translate=r,this.socket=c,this.tabRoles=[],this.prodUpdate=!1,this.display=!1,this.products=[],this.takeProductItems(),this.languageChanged()}ngOnInit(){console.log("ProductPackItemAddsPage"),this.tabRoles=JSON.parse(localStorage.getItem("roles")),(this.tabRoles.includes(1)||this.tabRoles.includes(2))&&(this.display=!0,this.adminId=localStorage.getItem("adminId"),this.webServerSocket(this.adminId))}languageChanged(){console.log("lang shop page");let t=localStorage.getItem("language");t&&this.translateConfigService.setLanguage(t)}takeProductItems(){this.restApiService.getProductItem().subscribe(t=>(0,l.mG)(this,void 0,void 0,function*(){this.productsItem=t,console.log(this.productsItem),this.productsItem=yield t.sort((t,e)=>t.name>e.name?1:-1),this.products.forEach(t=>{let e=this.productsItem.filter(e=>e.maeriId==t.maeriId);2===e.length&&e.forEach(t=>{(t.quantityStore||t.tabitem.length)&&this.restApiService.deleteProductItem(t._id).subscribe(t=>{})}),e.length&&e.forEach(t=>{(t.quantityStore||t.tabitem.length)&&this.restApiService.deleteProductItem(t._id).subscribe(t=>{})})})}))}takeProduct(){this.restApiService.getProduct().subscribe(t=>{this.products=t.products,console.log(this.products),this.takeProductItems()})}webServerSocket(t){this.socket.connect(),this.socket.emit("set-name",name),this.socket.fromEvent(`${t}newProductItem`).subscribe(t=>(0,l.mG)(this,void 0,void 0,function*(){this.productsItem.unshift(t)})),this.socket.fromEvent(`${t}productItem`).subscribe(t=>(0,l.mG)(this,void 0,void 0,function*(){if(console.log("pack item change "),t&&t._id){let e=yield this.productsItem.findIndex(e=>e._id===t._id);this.productsItem.splice(e,1,t)}})),this.socket.fromEvent(`${t}productItemDelete`).subscribe(t=>(0,l.mG)(this,void 0,void 0,function*(){console.log("items delete",t)}))}updateItems(t){console.log(t),this.prodUpdate=!0,this.dataItem=t}displayDetails(t){return(0,l.mG)(this,void 0,void 0,function*(){const e=yield this.modalController.create({component:a.v,componentProps:{product:t}});return e.onDidDismiss().then(t=>{console.log(t),console.log(t.data),"erico"===t.data&&console.log("hello")}),yield e.present()})}presentAlert(t){return(0,l.mG)(this,void 0,void 0,function*(){const e=yield this.alertController.create({header:"ELPIS",subHeader:` ${t}`,buttons:["OK"]});yield e.present()})}deleteProductItems(t){console.log(t);let e=t._id;this.restApiService.deleteProductItem(e).subscribe(t=>{console.log(t),this.productsItem=this.productsItem.filter(t=>t._id!==e)})}presentActionSheet(t){return(0,l.mG)(this,void 0,void 0,function*(){console.log(t);const e=yield this.actionSheetController.create({buttons:[{text:"View Details",icon:"heart",handler:()=>{this.displayDetails(t)}},{text:"Reset",icon:"close",handler:()=>{console.log("Cancel clicked"),console.log(t),this.restApiService.resetProductItem({id:t._id}).subscribe(t=>{console.log(t)})}}]});yield e.present()})}presentToast(){return(0,l.mG)(this,void 0,void 0,function*(){(yield this.toastController.create({message:"product have been save.",duration:2e3,position:"top",animated:!0,cssClass:"my-custom-class"})).present()})}presentToastError(){return(0,l.mG)(this,void 0,void 0,function*(){(yield this.toastController.create({message:"error update.",duration:5e3,position:"top",animated:!0})).present()})}updateProd(t){t.value.id=this.dataItem._id,console.log(t.value),this.restApiService.updateProductItem(t.value).subscribe(t=>{this.prodUpdate=!1,this.dataItem="",this.presentToast(),console.log(t)},t=>{console.log(t),this.presentToastError(),this.prodUpdate=!1,this.dataItem=""})}}return t.\u0275fac=function(e){return new(e||t)(d.Y36(u.e),d.Y36(r.IN),d.Y36(r.Br),d.Y36(r.BX),d.Y36(r.yF),d.Y36(p.w),d.Y36(c.sK),d.Y36(m.sk))},t.\u0275cmp=d.Xpm({type:t,selectors:[["app-product-item-list"]],decls:12,vars:7,consts:[["color","primary"],[1,"titre"],["slot","end",4,"ngIf"],["slot","start"],["autoHide","false"],["lines","full",4,"ngIf"],[4,"ngIf"],[3,"ngSubmit",4,"ngIf"],["slot","end"],[3,"routerLink"],["name","add-circle-outline"],["lines","full"],["lines","full",4,"ngFor","ngForOf"],[3,"src"],[1,"ion-text-wrap"],[1,"name"],["color","warning","fill","outline","slot","end",3,"click"],[3,"ngSubmit"],["form","ngForm"],["color","primary","justify-content-center",""],["align-self-center","","size-md","6","size-lg","5","size-xs","12"],["padding",""],["position","floating"],["name","newquantity","type","number","placeholder","En stock","ngModel","","required",""],["name","description","rows","6","cols","20","placeholder","Enter more informations..."],["color","danger","size","large","type","submit","expand","block",3,"disabled"]],template:function(t,e){1&t&&(d.TgZ(0,"ion-header"),d.TgZ(1,"ion-toolbar",0),d.TgZ(2,"ion-title",1),d._uU(3),d.ALo(4,"translate"),d.qZA(),d.YNc(5,h,3,2,"ion-buttons",2),d.TgZ(6,"ion-buttons",3),d._UZ(7,"ion-menu-button",4),d.qZA(),d.qZA(),d.qZA(),d.TgZ(8,"ion-content"),d.YNc(9,Z,2,1,"ion-list",5),d.YNc(10,I,5,2,"ion-card",6),d.YNc(11,b,17,1,"form",7),d.qZA()),2&t&&(d.xp6(3),d.Oqu(d.lcZ(4,5,"MENU.products")),d.xp6(2),d.Q6J("ngIf",e.display),d.xp6(4),d.Q6J("ngIf",e.productsItem&&!e.prodUpdate),d.xp6(1),d.Q6J("ngIf",e.dataItem&&e.prodUpdate),d.xp6(1),d.Q6J("ngIf",e.dataItem&&e.prodUpdate))},directives:[r.Gu,r.sr,r.wd,i.O5,r.Sm,r.fG,r.W2,r.YG,r.YI,n.rH,r.gu,r.q_,i.sg,r.Ie,r.BJ,r.Q$,r.PM,r.FN,s.Y7,s.JL,s.F,r.jY,r.Nd,r.wI,r.pK,r.as,s.JJ,s.On,s.Q7,r.g2,r.j9],pipes:[c.X$],styles:[".name[_ngcontent-%COMP%]{font-weight:700}"]}),t})()}];let v=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=d.oAB({type:t}),t.\u0275inj=d.cJS({imports:[[i.ez,s.u5,r.Pc,n.Bz.forChild(A),c.aw.forChild()]]}),t})()}}]);