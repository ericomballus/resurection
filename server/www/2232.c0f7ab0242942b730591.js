(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[2232],{3685:(t,e,i)=>{"use strict";i.d(e,{E:()=>p});var o=i(4762),n=i(1572),s=i(8158),c=i(731),r=i(1064),l=i(2874),a=i(1714),d=i(4375),m=i(1511);function u(t,e){if(1&t){const t=n.EpF();n.TgZ(0,"ion-checkbox",7),n.NdJ("ionChange",function(){n.CHM(t);const e=n.oxw().$implicit;return n.oxw().selectProduct(e)}),n.qZA()}}function h(t,e){if(1&t){const t=n.EpF();n.TgZ(0,"ion-checkbox",8),n.NdJ("ionChange",function(){n.CHM(t);const e=n.oxw().$implicit;return n.oxw().selectProduct(e)}),n.qZA()}}function g(t,e){if(1&t&&(n.TgZ(0,"ion-item"),n.TgZ(1,"ion-label"),n._uU(2),n.qZA(),n.YNc(3,u,1,0,"ion-checkbox",5),n.YNc(4,h,1,0,"ion-checkbox",6),n.qZA()),2&t){const t=e.$implicit;n.xp6(2),n.Oqu(t.name),n.xp6(1),n.Q6J("ngIf",t.isChecked),n.xp6(1),n.Q6J("ngIf",!t.isChecked)}}let p=(()=>{class t{constructor(t,e,i,o,n,s,c){this.modalController=t,this.translateConfigService=e,this.translate=i,this.notification=o,this.gammeService=n,this.notifi=s,this.random=c}ngOnInit(){return(0,o.mG)(this,void 0,void 0,function*(){let t=this.gammeService.getProducts(),e=this.random.getStoreId();console.log("storeId here",e),t&&t.length?(console.log("liste take",t),this.productTab=t):(this.notifi.presentLoading(),yield this.gammeService.getProductService(),this.productTab=this.gammeService.getProducts(),this.notifi.dismissLoading()),this.productTab=this.productTab.filter(t=>t.storeId==e),this.productTab=this.productTab.sort((t,e)=>t.name>e.name?1:-1),this.product=this.gammeService.getGamme(),this.productClone=this.gammeService.getGamme().productList,this.checkIfSelect()})}closeModal(){this.notification.presentLoading(),this.product.productList=this.productClone,this.productTab.forEach(t=>{t.isChecked=!1}),this.notification.dismissLoading(),this.modalController.dismiss({cancel:!0})}saveAndCloseModal(){this.notification.presentLoading(),this.gammeService.setGamme(this.product),this.productTab.forEach(t=>{t.isChecked=!1}),this.notification.dismissLoading(),this.modalController.dismiss()}selectProduct(t){t.isChecked?(t.isChecked=!1,this.product.removeToProductList(t),this.gammeService.removeToProducList(t)):(t.isChecked=!0,t.toRemove=1,this.product.addToProductList(t),this.gammeService.saveToAddProductList(t))}checkIfSelect(){this.product.productList.length?(this.product.productList.forEach(t=>{this.productTab.forEach(e=>{e._id==t._id&&(e.isChecked=!0)})}),this.productTab.forEach(t=>{t.isChecked||(t.isChecked=!1)})):this.productTab.forEach(t=>{t.isChecked=!1})}}return t.\u0275fac=function(e){return new(e||t)(n.Y36(s.IN),n.Y36(c.w),n.Y36(r.sK),n.Y36(l.g),n.Y36(a.K),n.Y36(l.g),n.Y36(d.i))},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-product-for-gamme"]],decls:14,vars:7,consts:[["slot","end"],["size","small","fill","outline","color","primary",3,"click"],["size","small","fill","outline","color","danger",3,"click"],["slot","icon-only","name","close"],[4,"ngFor","ngForOf"],["checked","true","slot","end",3,"ionChange",4,"ngIf"],["slot","end",3,"ionChange",4,"ngIf"],["checked","true","slot","end",3,"ionChange"],["slot","end",3,"ionChange"]],template:function(t,e){1&t&&(n.TgZ(0,"ion-header"),n.TgZ(1,"ion-toolbar"),n._UZ(2,"ion-title"),n.TgZ(3,"ion-buttons",0),n.TgZ(4,"ion-button",1),n.NdJ("click",function(){return e.saveAndCloseModal()}),n._uU(5),n.ALo(6,"translate"),n.qZA(),n.TgZ(7,"ion-button",2),n.NdJ("click",function(){return e.closeModal()}),n._uU(8),n.ALo(9,"translate"),n._UZ(10,"ion-icon",3),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.TgZ(11,"ion-content"),n.TgZ(12,"ion-list"),n.YNc(13,g,5,3,"ion-item",4),n.qZA(),n.qZA()),2&t&&(n.xp6(5),n.hij(" ",n.lcZ(6,3,"MENU.save")," "),n.xp6(3),n.hij(" ",n.lcZ(9,5,"MENU.cancel")," "),n.xp6(5),n.Q6J("ngForOf",e.productTab))},directives:[s.Gu,s.sr,s.wd,s.Sm,s.YG,s.gu,s.W2,s.q_,m.sg,s.Ie,s.Q$,m.O5,s.nz,s.w],pipes:[r.X$],styles:[""]}),t})()},2034:(t,e,i)=>{"use strict";i.d(e,{R:()=>o});class o{constructor(t,e,i,o,n){this.removeProductList=[],this.addProductList=[],this._id="",this.desabled=!1,this.nbr=0,this.quantityToSale=1,this.productType="Gamme",this.url=" ",this.originalname="",this.filename="",this.newUrl="",this.remove=!1,this.nbrRandom=0,this.name=t,this.productList=e,this.sellingPrice=i,this._id=o,this.adminId=localStorage.getItem("adminId"),this.created=n||Date.now()}addToProductList(t){this.productList.find(e=>e._id==t._id)?console.log("existe deja"):(this.productList.push(t),console.log("resultat==>",this.productList))}removeToProductList(t,e){this.productList=this.productList.filter(e=>e._id!==t._id)}getProductList(){return this.productList}}},5258:(t,e,i)=>{"use strict";i.r(e),i.d(e,{DeleteBillPageModule:()=>z});var o=i(1511),n=i(6073),s=i(8158),c=i(8777),r=i(4762),l=i(5959),a=i(5416),d=i(728),m=i(1572),u=i(731),h=i(4375),g=i(1714),p=i(2874),f=i(5946),Z=i(1064),v=i(3547);function q(t,e){if(1&t&&(m.TgZ(0,"ion-col",10),m.TgZ(1,"div",19),m.TgZ(2,"small",20),m._uU(3),m.qZA(),m.qZA(),m.qZA()),2&t){const t=m.oxw().$implicit;m.xp6(3),m.hij(" ",t.item.name,"")}}function T(t,e){if(1&t&&(m.TgZ(0,"ion-col",10),m.TgZ(1,"div",19),m.TgZ(2,"small"),m._uU(3),m.qZA(),m.qZA(),m.qZA()),2&t){const t=m.oxw().$implicit;m.xp6(3),m.hij(" ",t.qty?t.qty:0," ")}}const A=function(t){return[t,"FCFA","symbol","3.0-0","fr"]};function b(t,e){if(1&t&&(m.TgZ(0,"ion-col",10),m.TgZ(1,"div",21),m.TgZ(2,"small",22),m._uU(3),m.ALo(4,"currency"),m.qZA(),m.qZA(),m.qZA()),2&t){const t=m.oxw().$implicit;m.xp6(3),m.hij(" ",m.G7q(4,1,m.VKq(7,A,t.price)),"")}}function y(t,e){if(1&t){const t=m.EpF();m.TgZ(0,"ion-button",28),m.NdJ("click",function(){m.CHM(t);const e=m.oxw(2),i=e.$implicit,o=e.index;return m.oxw().removeOne(i,o)}),m._UZ(1,"ion-icon",29),m.qZA()}}function R(t,e){if(1&t){const t=m.EpF();m.TgZ(0,"ion-button",30),m.NdJ("click",function(){m.CHM(t);const e=m.oxw(2),i=e.$implicit,o=e.index;return m.oxw().removeFromChild(i,o)}),m._UZ(1,"ion-icon",29),m.qZA()}}function x(t,e){if(1&t&&(m.TgZ(0,"ion-col",23),m.TgZ(1,"ion-row",24),m.TgZ(2,"ion-col",25),m.TgZ(3,"div",9),m.YNc(4,y,2,0,"ion-button",26),m.YNc(5,R,2,0,"ion-button",27),m.qZA(),m.qZA(),m.qZA(),m.qZA()),2&t){const t=m.oxw().$implicit,e=m.oxw();m.xp6(4),m.Q6J("ngIf",t.qty>0&&0==e.bill.refundVoucher.length),m.xp6(1),m.Q6J("ngIf",e.bill.refundVoucher.length)}}const S=function(t){return{"background-color":t}};function I(t,e){if(1&t&&(m.TgZ(0,"ion-row",16),m.YNc(1,q,4,1,"ion-col",17),m.YNc(2,T,4,1,"ion-col",17),m.YNc(3,b,5,9,"ion-col",17),m.YNc(4,x,6,2,"ion-col",18),m.qZA()),2&t){const t=e.$implicit;m.Q6J("ngStyle",m.VKq(5,S,e.index%2==0?"#f1f1f1":"white")),m.xp6(1),m.Q6J("ngIf",!(t.item.modeNG||t.item.modeG||t.item.CA||t.item.BTL)),m.xp6(1),m.Q6J("ngIf",!(t.item.modeNG||t.item.modeG||t.item.CA||t.item.BTL)),m.xp6(1),m.Q6J("ngIf",!(t.item.modeNG||t.item.modeG||t.item.CA||t.item.BTL)),m.xp6(1),m.Q6J("ngIf",!(t.item.modeG||t.item.modeNG||t.item.CA||t.item.BTL))}}function L(t,e){if(1&t&&(m.TgZ(0,"ion-col",31),m.TgZ(1,"div",9),m.TgZ(2,"h6",32),m._uU(3,"produits retour"),m.qZA(),m.qZA(),m._UZ(4,"app-retour-produits",33),m.qZA()),2&t){const t=m.oxw();m.xp6(4),m.Q6J("products",t.toRemove)}}function C(t,e){if(1&t){const t=m.EpF();m.TgZ(0,"ion-row"),m.TgZ(1,"ion-col",34),m.TgZ(2,"ion-button",35),m.NdJ("click",function(){return m.CHM(t),m.oxw().cancelBill()}),m._uU(3),m.ALo(4,"translate"),m.qZA(),m.qZA(),m.qZA()}2&t&&(m.xp6(3),m.Oqu(m.lcZ(4,1,"MENU.save")))}function w(t,e){if(1&t&&(m.TgZ(0,"ion-col",31),m.TgZ(1,"div",9),m.TgZ(2,"h6",32),m._uU(3),m.ALo(4,"translate"),m.qZA(),m.qZA(),m._UZ(5,"app-retour-produits",33),m.TgZ(6,"div",37),m.TgZ(7,"h6",32),m._uU(8),m.ALo(9,"currency"),m.qZA(),m.qZA(),m.qZA()),2&t){const t=e.$implicit,i=e.index,o=m.oxw(2);m.xp6(3),m.AsE(" ",m.lcZ(4,4,"MENU.purchaseVoucher")," ",i+1," "),m.xp6(2),m.Q6J("products",t),m.xp6(3),m.hij(" Total: ",m.G7q(9,6,m.VKq(12,A,o.priceArr[i]))," ")}}function _(t,e){if(1&t&&(m.TgZ(0,"ion-row"),m.YNc(1,w,10,14,"ion-col",36),m.qZA()),2&t){const t=m.oxw();m.xp6(1),m.Q6J("ngForOf",t.toRemoveArr)}}const k=[{path:"",component:(()=>{class t{constructor(t,e,i,o,n,s,c,r){this.translateConfigService=t,this.saveRandom=e,this.gammeService=i,this.modalCrtl=o,this.notifi=n,this.adminService=s,this.navCrtl=c,this.translate=r,this.products=[],this.productsRandom=[],this.toRemove=[],this.destroy$=new l.xQ,this.randomObj={},this.gammeList={},this.toRemoveArr=[],this.productsRestant=[],this.priceArr=[],this.desableBtn=!1}ngOnInit(){this.languageChanged(),this.bill=this.saveRandom.getData(),this.facture=this.saveRandom.getData(),(this.bill.partiallyCancel||this.bill.purchaseOrder.length||this.toRemoveArr.length)&&(this.desableBtn=!0),this.init()}init(){this.bill.commandes.forEach(t=>{this.products=this.products.length?[...this.products,...t.products]:t.products,this.bill.purchaseOrder.length&&this.bill.purchaseOrder.forEach(t=>{this.toRemoveArr.push(t.toRemove),this.priceArr.push(t.price)})}),JSON.parse(localStorage.getItem("voucherBill")).commandes.forEach(t=>{this.productsRandom=this.productsRandom.length?[...this.productsRandom,...t.products]:t.products}),this.toRemoveArr.length&&(this.desableBtn=!0),this.productsRandom.forEach(t=>{this.toRemoveArr.forEach(e=>{e.forEach(e=>{t.item._id==e.item._id&&(t.qty=t.qty-e.qty)})})}),console.log("best ==",this.productsRandom),localStorage.removeItem("productsRandom"),localStorage.setItem("billProducts",JSON.stringify(this.products))}languageChanged(){let t=localStorage.getItem("language");t&&this.translateConfigService.setLanguage(t)}changeProdPrice(t,e){console.log(e)}addOne(t,e){let i=t.item;t.qty=t.qty+1,t.removeQuantity=t.removeQuantity?t.removeQuantity-1:1,t.price=t.price+t.item.sellingPrice,"Gamme"==i.productType?t.item.productList.forEach(t=>{this.gammeRestore(t)}):(this.toRemove.forEach(e=>{e._id==t.item._id&&(e.quantityRandom=e.quantityRandom-1)}),this.addInStorage(e))}removeOne(t,e){if(0!=this.productsRandom[e].qty)if("Gamme"==t.item.productType)this.buyGamme(t.item,t,e);else{t.qty=t.qty-1,t.price=t.price-t.item.sellingPrice,t.removeQuantity=t.removeQuantity?t.removeQuantity+1:1;let i=this.toRemove.findIndex(e=>e._id==t.item._id);i>=0?this.toRemove[i].quantityRandom=this.toRemove[i].quantityRandom+1:(t.item.quantityRandom=1,this.toRemove.push(t.item)),this.removeInStorage(e)}else this.notifi.presentAlert("impossible de poursuivre cette op\xe9ration car le produit selectionn\xe9 a deja \xe9t\xe9 retourn\xe9 dans le magasin")}removeFromChild(t,e){console.log(this.bill.refundVoucher[this.bill.refundVoucher.length-1]),console.log(t)}buyGamme(t,e,i){return(0,r.mG)(this,void 0,void 0,function*(){t.remove=!0,t.quantityToSale=e.qty,t.productList.forEach(t=>{t.toRemove=t.toRemove*e.qty}),this.gammeService.setGamme(t);const o=yield this.modalCrtl.create({component:d.W,componentProps:{}});return o.onDidDismiss().then(t=>{let o=this.saveRandom.getProducListGamme();this.addProductListToGamme(i,o),t.data&&t.data.removeToList&&t.data.removeToList.length&&(e.qty=t.data.quantity,this.removeInStorage(i),t.data.removeToList.forEach(t=>{this.ma(t)}))}),yield o.present()})}ma(t){let e=this.toRemove.findIndex(e=>e._id==t._id);e>=0?this.toRemove[e].quantityRandom=this.toRemove[e].quantityRandom+t.toRemove:(t.quantityRandom=t.toRemove,this.toRemove.push(t))}gammeRestore(t){this.toRemove.forEach(e=>{e._id==t._id&&e.quantityRandom&&(e.quantityRandom=e.quantityRandom-1)})}cancelBill(){this.toRemove.forEach(t=>{t.qty=t.quantityRandom,t.quantityRandom=t.quantityRandom,t.toRemove=t.quantityRandom}),this.notifi.presentAlertConfirm("DELETE ORDER ?").then(t=>{this.notifi.presentLoading();let e=[];this.bill.invoiceCancel=!0,this.bill.commandes.forEach(t=>{e=e.length?[...e,...t.products]:t.products});let i=[];console.log(this.toRemove);let o=0;this.toRemove.forEach(t=>{o+=t.toRemove*t.sellingPrice,i.push({_id:t._id,name:t.name,productType:t.productType,qty:t.toRemove,toRemove:t.toRemove,sellingPrice:t.sellingPrice,totalPrice:t.toRemove*t.sellingPrice,item:{_id:t._id,productType:t.productType,qty:t.toRemove,toRemove:t.toRemove}})});let n=JSON.parse(localStorage.getItem("billProducts"));n||(n=null),this.adminService.cancelOrder(this.bill.localId,e,this.facture,i,o,n).pipe((0,a.R)(this.destroy$)).subscribe(t=>{console.log("cancel bill ok ====ligne 294"),localStorage.removeItem("billProducts"),this.notifi.dismissLoading(),this.navCrtl.back()})}).catch(t=>{this.toRemove=[],this.bill=this.facture,this.navCrtl.back()})}modificationPrecedente(){this.bill.purchaseOrder.forEach(t=>{})}createRefundVoucher(){let t=this.gammeService.getGamme(),e=JSON.parse(localStorage.getItem("oldGamme"));this.gammeList[e._id]={oldGamme:e,newGamme:t}}removeInStorage(t){let e=JSON.parse(localStorage.getItem("billProducts")),i=e[t];i.qty=i.qty-1,i.price=i.qty*i.item.sellingPrice,e.splice(t,1,i),localStorage.setItem("billProducts",JSON.stringify(e))}addInStorage(t){let e=JSON.parse(localStorage.getItem("billProducts")),i=e[t];i.qty=i.qty+1,i.price=i.qty*i.item.sellingPrice,e.splice(t,1,i),localStorage.setItem("billProducts",JSON.stringify(e))}addProductListToGamme(t,e){let i=JSON.parse(localStorage.getItem("billProducts")),o=i[t];o.item.productList=e,i.splice(t,1,o),localStorage.setItem("billProducts",JSON.stringify(i))}AnnulerFacture(){this.notifi.presentLoading(),this.toRemove=[],this.facture.commandes.forEach(t=>{this.toRemove=[...this.toRemove,...t.products]}),this.facture.cancel=!0,this.adminService.cancelOrder2(this.facture.localId,this.toRemove,this.facture).subscribe(t=>{console.log("suppression ok",t),this.notifi.dismissLoading(),this.navCrtl.back()})}}return t.\u0275fac=function(e){return new(e||t)(m.Y36(u.w),m.Y36(h.i),m.Y36(g.K),m.Y36(s.IN),m.Y36(p.g),m.Y36(f.l),m.Y36(s.SH),m.Y36(Z.sK))},t.\u0275cmp=m.Xpm({type:t,selectors:[["app-delete-bill"]],decls:36,vars:18,consts:[["slot","start"],["defaultHref","/start"],["slot","end"],["color","danger","size","small",3,"disabled","click"],["size","12","size-md","6","size-lg","6"],[1,"ion-text-center","ion-text-uppercase"],["size","12","size-md","7","size-lg","7"],[1,"header-tab"],["size","3","size-md","3"],[1,"ion-text-center"],["size","3"],["size","3",1,"ion-align-self-center"],["size","3","size-md","3",1,"ion-align-self-center","ion-hide-sm-down"],["class","data-row data-update",3,"ngStyle",4,"ngFor","ngForOf"],["size","12","size-md","4","size-lg","4",4,"ngIf"],[4,"ngIf"],[1,"data-row","data-update",3,"ngStyle"],["size","3",4,"ngIf"],["class","divIcon","size","3",4,"ngIf"],[1,"ion-text-center","ion-text-uppercase","ion-text-nowrap"],[1,"namesmall"],[1,"ion-text-center","ion-text-nowrap"],[1,"pricesmall"],["size","3",1,"divIcon"],[1,"ion-justify-content-between"],["size","3",1,"ion-margin-end"],["size","small","fill","clear",3,"click",4,"ngIf"],["size","small","fill","clear","color","danger",3,"click",4,"ngIf"],["size","small","fill","clear",3,"click"],["name","remove-circle-outline"],["size","small","fill","clear","color","danger",3,"click"],["size","12","size-md","4","size-lg","4"],[2,"text-transform","uppercase"],[3,"products"],["offset","4","offset-md","4","offset-lg","4","size","4","size-md","4","size-lg","4"],[3,"click"],["size","12","size-md","4","size-lg","4",4,"ngFor","ngForOf"],[1,"ion-text-center",2,"font-weight","bold","padding","5px"]],template:function(t,e){1&t&&(m.TgZ(0,"ion-header"),m.TgZ(1,"ion-toolbar"),m.TgZ(2,"ion-buttons",0),m._UZ(3,"ion-back-button",1),m.qZA(),m.TgZ(4,"ion-buttons",2),m.TgZ(5,"ion-button",3),m.NdJ("click",function(){return e.AnnulerFacture()}),m._uU(6),m.ALo(7,"translate"),m.qZA(),m.qZA(),m.qZA(),m.qZA(),m.TgZ(8,"ion-content"),m.TgZ(9,"ion-grid"),m.TgZ(10,"ion-row"),m.TgZ(11,"ion-col",4),m.TgZ(12,"div",5),m._uU(13),m.qZA(),m.qZA(),m.TgZ(14,"ion-col",4),m.TgZ(15,"div",5),m._uU(16),m.ALo(17,"currency"),m.qZA(),m.qZA(),m.qZA(),m.TgZ(18,"ion-row"),m.TgZ(19,"ion-col",6),m.TgZ(20,"ion-row",7),m.TgZ(21,"ion-col",8),m.TgZ(22,"div",9),m._uU(23,"name"),m.qZA(),m.qZA(),m.TgZ(24,"ion-col",10),m.TgZ(25,"div",9),m._uU(26,"Qty"),m.qZA(),m.qZA(),m.TgZ(27,"ion-col",11),m.TgZ(28,"div",9),m._uU(29,"T.price"),m.qZA(),m.qZA(),m.TgZ(30,"ion-col",12),m._UZ(31,"div",9),m.qZA(),m.qZA(),m.YNc(32,I,5,7,"ion-row",13),m.qZA(),m.YNc(33,L,5,1,"ion-col",14),m.qZA(),m.YNc(34,C,5,3,"ion-row",15),m.YNc(35,_,2,1,"ion-row",15),m.qZA(),m.qZA()),2&t&&(m.xp6(5),m.Q6J("disabled",e.desableBtn),m.xp6(1),m.Oqu(m.lcZ(7,8,"MENU.delete")),m.xp6(7),m.hij(" facture ",e.bill.numFacture," "),m.xp6(3),m.hij(" TOTAL: ",m.G7q(17,10,m.VKq(16,A,e.bill.montant))," "),m.xp6(16),m.Q6J("ngForOf",e.products),m.xp6(1),m.Q6J("ngIf",e.toRemove.length),m.xp6(1),m.Q6J("ngIf",e.toRemove.length),m.xp6(1),m.Q6J("ngIf",e.toRemoveArr.length))},directives:[s.Gu,s.sr,s.Sm,s.oU,s.cs,s.YG,s.W2,s.jY,s.Nd,s.wI,o.sg,o.O5,o.PC,s.gu,v._],pipes:[Z.X$,o.H9],styles:[""]}),t})()}];let N=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=m.oAB({type:t}),t.\u0275inj=m.cJS({imports:[[c.Bz.forChild(k)],c.Bz]}),t})();var P=i(9547);let z=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=m.oAB({type:t}),t.\u0275inj=m.cJS({imports:[[o.ez,n.u5,s.Pc,N,Z.aw.forChild(),P.G]]}),t})()}}]);