(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[3400],{6264:(t,e,n)=>{"use strict";n.r(e),n.d(e,{BeforeInventoryPageModule:()=>A});var i=n(1511),o=n(6073),s=n(8158),a=n(8777),r=n(4762),c=n(1572),l=n(4144),u=n(4892),d=n(731),h=n(866),g=n(1064),m=n(5946),p=n(2968),b=n(5604),y=n(2874),f=n(2487),I=n(4375),O=n(754);const q=["nbrCassier"],v=["nbrBtl"];function C(t,e){1&t&&(c.TgZ(0,"ion-segment-button",13),c.TgZ(1,"ion-label"),c._uU(2),c.ALo(3,"translate"),c.qZA(),c.qZA()),2&t&&(c.xp6(2),c.Oqu(c.lcZ(3,1,"MENU.drinks")))}function S(t,e){1&t&&(c.TgZ(0,"ion-segment-button",14),c.TgZ(1,"ion-label"),c._uU(2),c.ALo(3,"translate"),c.qZA(),c.qZA()),2&t&&(c.xp6(2),c.Oqu(c.lcZ(3,1,"MENU.dishes")))}function _(t,e){1&t&&(c.TgZ(0,"ion-segment-button",15),c.TgZ(1,"ion-label"),c._uU(2),c.ALo(3,"translate"),c.qZA(),c.qZA()),2&t&&(c.xp6(2),c.Oqu(c.lcZ(3,1,"MENU.service")))}function Z(t,e){if(1&t){const t=c.EpF();c.TgZ(0,"ion-segment",9),c.NdJ("ionChange",function(e){return c.CHM(t),c.oxw().segmentChanged(e)})("ngModelChange",function(e){return c.CHM(t),c.oxw().pet=e}),c.YNc(1,C,4,3,"ion-segment-button",10),c.YNc(2,S,4,3,"ion-segment-button",11),c.YNc(3,_,4,3,"ion-segment-button",12),c.qZA()}if(2&t){const t=c.oxw();c.Q6J("ngModel",t.pet),c.xp6(1),c.Q6J("ngIf",t.storeTypes.includes("bar")),c.xp6(1),c.Q6J("ngIf",t.storeTypes.includes("resto")),c.xp6(1),c.Q6J("ngIf",t.storeTypes.includes("services"))}}const P=function(t){return{"background-color":t}};function x(t,e){if(1&t){const t=c.EpF();c.TgZ(0,"ion-row",16),c.TgZ(1,"ion-col",4),c.TgZ(2,"div",17),c._uU(3),c.qZA(),c.qZA(),c.TgZ(4,"ion-col",4),c._UZ(5,"div",5),c.qZA(),c.TgZ(6,"ion-col",6),c.TgZ(7,"div",5),c.TgZ(8,"ion-input",18,19),c.NdJ("ionChange",function(n){c.CHM(t);const i=e.$implicit,o=e.index;return c.oxw().addIncrementCassier(n,i,o)}),c.qZA(),c.qZA(),c.qZA(),c.TgZ(10,"ion-col",6),c.TgZ(11,"div",5),c.TgZ(12,"ion-input",20,21),c.NdJ("ionChange",function(n){c.CHM(t);const i=e.$implicit,o=e.index;return c.oxw().addIncrement(n,i,o)}),c.qZA(),c.qZA(),c.qZA(),c.qZA()}if(2&t){const t=e.$implicit,n=e.index,i=c.oxw();c.Q6J("hidden",!i.btnProducts)("ngStyle",c.VKq(5,P,n%2==0?"#f1f1f1":"white")),c.xp6(3),c.Oqu(t.name),c.xp6(5),c.Q6J("ngStyle",c.VKq(7,P,t.alert?"red":"white")),c.xp6(4),c.Q6J("ngStyle",c.VKq(9,P,t.alert?"red":"white"))}}function M(t,e){if(1&t){const t=c.EpF();c.TgZ(0,"ion-row",16),c.TgZ(1,"ion-col",4),c.TgZ(2,"div",17),c._uU(3),c.qZA(),c.qZA(),c.TgZ(4,"ion-col",22),c._UZ(5,"div",5),c.qZA(),c.TgZ(6,"ion-col",23),c.TgZ(7,"div",5),c.TgZ(8,"ion-input",24),c.NdJ("ionChange",function(n){c.CHM(t);const i=e.$implicit,o=e.index;return c.oxw().addIncrementResto(n,i,o)}),c.qZA(),c.qZA(),c.qZA(),c.qZA()}if(2&t){const t=e.$implicit,n=e.index,i=c.oxw();c.Q6J("hidden",!i.btnResto)("ngStyle",c.VKq(3,P,n%2==0?"#f1f1f1":"white")),c.xp6(3),c.Oqu(t.name)}}const T=[{path:"",component:(()=>{class t{constructor(t,e,n,i,o,s,a,r,c,l,u,d,h,g,m,p,b,y,f,I){this.restApiService=t,this.modalController=e,this.alertController=n,this.actionSheetController=i,this.toastController=o,this.loadingController=s,this.socket=a,this.router=r,this.translateConfigService=c,this.warehouseService=l,this.warehouService=u,this.translate=d,this.adminService=h,this.urlService=g,this.countItemsService=m,this.notification=p,this.managerService=b,this.randomStorage=y,this.location=f,this.ficheService=I,this.commande=!1,this.resourceTab=[],this.tabRoles=[],this.num=2,this.btnProducts=!0,this.btnResto=!1,this.btnService=!1,this.lat=0,this.lng=0,this.viewMode="invoices",this.shopAutorisation=!1,this.totalItems=0,this.desktopTab=[],this.transaction=[],this.tab=[],this.plat=[],this.isLoading=!1,this.cashClose=0,this.manageStockWithService=!1,this.totalSale=0,this.resultValue=0,this.perte=0,this.resultValueFake=!0,this.openCash=0,this.totalOut=0,this.randomObj={},this.inventoryObj={},this.quantityIn={},this.quantityOut={},this.resourceOut={},this.resourceIn={},this.texte="please wait we are building your inventory...",this.numb=1,this.allAdd=0,this.allOut=0,this.lastInventory=[],this.lastInventoryObject={},this.listStart=[],this.listStartObject={},this.storeTypes=[],this.languageChanged()}ngOnInit(){console.log(this.router.getCurrentNavigation());let t=this.randomStorage.getSetting();this.storeTypes=this.randomStorage.getAdminAccount().storeType,1==this.storeTypes.length&&this.storeTypes.includes("services")&&(this.btnService=!0),this.manageStockWithService=t.manageStockWithService,this.manageStockWithService?(JSON.parse(localStorage.getItem("user")).name&&(this.userName=JSON.parse(localStorage.getItem("user")).name),this.tabRoles=JSON.parse(localStorage.getItem("roles")),(this.tabRoles.includes(1)||this.tabRoles.includes(3)||this.tabRoles.includes(2))&&(this.takeUrl(),this.storeTypes.includes("bar")&&this.takeProductItems(),this.storeTypes.includes("resto")&&this.takeProductResto(),this.getLastCashOpenDate())):(setTimeout(()=>{this.location.back()},3e3),this.translate.get("MENU.auth").subscribe(t=>{this.notification.presentToast(t,"primary")}))}takeUrl(){this.urlService.getUrl().subscribe(t=>{this.url=t,this.adminId=localStorage.getItem("adminId")})}takeFichePointage(){this.ficheService.getPointageList().subscribe(t=>{console.log("fiche pointage",t)})}languageChanged(){console.log("lang shop page");let t=localStorage.getItem("language");t&&this.translateConfigService.setLanguage(t)}takeProductItems(){this.restApiService.getProductItem().subscribe(t=>{t.forEach(t=>{t.name.replace(/\s/g,""),t.name=t.name.toUpperCase()}),t.sort((t,e)=>t.name>e.name?1:e.name>t.name?-1:0),this.restApiService.setData(t),this.segmentChangedEnter(),this.productsItem=t,this.productsItemRandom=t,this.productsItem.forEach(t=>(0,r.mG)(this,void 0,void 0,function*(){if(t.quantityToConfirm>0){let e=Math.trunc(t.quantityItems/t.packSize),n=t.quantityStore+t.quantityToConfirm,i=Math.trunc(n/t.packSize);t.cassier=e,t.btls=t.quantityItems%t.packSize,t.cassierStore=i,t.btlsStore=n%t.packSize}else{let e=Math.trunc(t.quantityItems/t.packSize),n=Math.trunc(t.quantityStore/t.packSize);t.cassier=e,t.btls=t.quantityItems%t.packSize,t.cassierStore=n,t.btlsStore=t.quantityStore%t.packSize}}))})}makeSumAddOut(){this.restApiService.getProductItem(2).subscribe(t=>{console.log(t),t.forEach(t=>{t._id.name.replace(/\s/g,""),t._id.name=t._id.name.toUpperCase()}),t.sort((t,e)=>t._id.name>e._id.name?1:e._id.name>t._id.name?-1:0),this.segmentChangedEnter(),this.productsItem=t,this.productsItem.forEach(t=>(0,r.mG)(this,void 0,void 0,function*(){t._id.cassier=t.quantity/t._id.packSize,t._id.btls=t.quantity}))})}takeProductItemsRandom(){}takeProductResto(){this.restApiService.getManufacturedProductItemResto2().subscribe(t=>{this.productResto=t})}segmentChanged(t){console.log("Segment changed",t.target.value);let e=t.target.value;"product"===e?(this.btnProducts=!0,this.btnResto=!1,this.btnService=!1):"productResto"===e?(this.btnResto=!0,this.btnProducts=!1,this.btnService=!1):"service"===e&&(this.btnService=!0,this.btnProducts=!1,this.btnResto=!1)}segmentChangedEnter(){this.pet="product"}presentAlertConfirm(){return(0,r.mG)(this,void 0,void 0,function*(){(yield this.toastController.create({message:"update successfuly!.",duration:2e3,position:"top",animated:!0,cssClass:"my-custom-classIn"})).present()})}presentLoading2(){return(0,r.mG)(this,void 0,void 0,function*(){return this.isLoading=!0,yield this.loadingController.create({duration:6e4,message:this.texte}).then(t=>{t.present().then(()=>{this.isLoading||t.dismiss().then()})})})}dismissLoading(){return(0,r.mG)(this,void 0,void 0,function*(){return this.isLoading=!1,yield this.loadingController.dismiss().then()})}clear(){this.productsItem.forEach(t=>{t.nbrCassier=0,t.sale=0,t.totalCoast=0,t.bouteille=0}),this.randomObj={},this.totalOut=0,this.totalSale=0}resetCol(t,e){delete this.randomObj[t],Object.keys(this.randomObj),this.inputs.forEach(t=>{t.name==`ion-input-${e}`&&(t.value="")})}addIncrementCassier(t,e,n){console.log(e);let i=parseInt(t.target.value);if(Number.isNaN(i)){let t=e._id;this.randomObj[t]={incommingValue:this.randomObj[t].incommingValue-e.cassierFound*e.packSize,prod:e},e.cassierFound=0}else{let t=i*e.packSize,n=e._id;console.log("value to add  =>",t),e.cassierFound=i,this.randomObj[n]=this.randomObj[n]?{incommingValue:t+this.randomObj[n].incommingValue,prod:e}:{incommingValue:t,prod:e},console.log(this.randomObj)}}addIncrement(t,e,n){let i=parseInt(t.target.value);if(Number.isNaN(i)){let t=e._id;this.randomObj[t]={incommingValue:this.randomObj[t].incommingValue-e.btlFound,prod:e},e.btlFound=0}else{let t=e._id,n=i,o=this.randomObj[t];e.btlFound=n,this.randomObj[t]=o?{incommingValue:n+this.randomObj[t].incommingValue,prod:e}:{incommingValue:n,prod:e},console.log(this.randomObj)}}addIncrementResto(t,e,n){let i=parseInt(t.target.value);if(Number.isNaN(i))delete this.randomObj[e._id],Object.keys(this.randomObj);else{let t=e._id,n=i;this.randomObj[t]=this.randomObj[t]?{incommingValue:n+this.randomObj[t].incommingValue,prod:e}:{incommingValue:n,prod:e},console.log(this.randomObj)}}generateArray(t){const e=[];for(var n in t)e.push(t[n]);return this.cart=e,e}launchAll(){return(0,r.mG)(this,void 0,void 0,function*(){let t=this.generateArray(this.randomObj);if(this.generateArray(this.quantityOut).length>t.length)this.notification.presentError("please make inventory for all product","warning");else{this.presentLoading2();let e=yield this.loopTabinventaire(t);console.log("resultat here ===>",t),e=yield this.loopTabinventaireOut(e),this.managerService.postInvetory(e,this.cashClose).subscribe(t=>{console.log(t),this.router.navigateByUrl("inventaire-list"),this.dismissLoading().then(t=>{console.log("load dismmiss")}).catch(t=>console.log(t))},t=>{console.log(t)})}})}takeTheLastInventory(){this.managerService.getLastInventory().subscribe(t=>{console.log(t),(new Date).toISOString(),t[0]&&t[0].Inventory&&(this.lastInventory=t[0])},t=>{console.log(t)})}takeLastPurchase(t,e){this.managerService.getLastPurchases(t,e).subscribe(t=>{console.log("dernier achats",t),t.length&&(t.forEach(t=>{t.articles.forEach(t=>{t.products.forEach(t=>{console.log(t);let e="";e=t.item&&t.item.productItemId?t.item.productItemId:t.item._id,t.item.resourceList&&t.item.resourceList.length&&this.manageResource(t,"in"),this.quantityIn[e]?this.quantityIn[e].quantityIN=t.item.sizePack?this.quantityIn[e].quantityIN+t.qty*t.item.sizePack:this.quantityIn[e].quantityIN+t.qty:this.quantityIn[e]=t.item.sizePack?{quantityIN:t.qty*t.item.sizePack}:{quantityIN:t.qty}})})}),console.log("quntity In ===>",this.quantityIn))},t=>{console.log(t)})}takeLastBills(t,e){this.managerService.getLastBills(t,e).subscribe(t=>{t.length&&(console.log("hello bills",t),t.forEach(t=>{t.commandes.forEach(t=>{t.products.forEach(t=>{t.item.resourceList&&t.item.resourceList.length&&this.manageResource(t,"out");let e=t.item._id;this.quantityOut[e]?this.quantityOut[e].quantityOUT=this.quantityOut[e].quantityOUT+parseInt(t.qty):this.quantityOut[e]={quantityOUT:parseInt(t.qty)}})})}))},t=>{console.log(t)})}getLastCashOpenDate(){this.managerService.getLastCashOpen().subscribe(t=>{this.cashClose=t[0].closing_cash,this.managerService.getLastInventorie(t[0]._id).subscribe(t=>{this.listStart=t,t[0].listsStart.forEach(t=>{this.listStartObject[t._id]=t})})},t=>{console.log("erororor",t)})}loopTabinventaire(t){return new Promise(e=>{t.forEach(t=>{let e=t.prod._id;this.listStartObject[e]?(t.quantityIn=this.listStartObject[e].quantityStore+this.listStartObject[e].quantityItems,t.quantityOUT=t.quantityIn-t.incommingValue,t.lastQuantityIn=t.quantityIn,t.quantityOUT>=0?t.reste=t.quantityOUT:(t.reste=0,t.surplus=-1*t.quantityOUT),t.start=t.quantityIn):(t.quantityIn=0,t.quantityOUT=0)}),e(t)})}loopTabinventaireOut(t){return new Promise(e=>{t.forEach(t=>{let e=t.prod._id;this.quantityOut[e]?(console.log(this.quantityOut[e]),t.quantityOut=this.quantityOut[e].quantityOUT,t.nextQuantityIn=this.lastInventoryObject[e]&&this.lastInventoryObject[e].lastQuantityIn?this.quantityIn[e]&&this.quantityIn[e].quantityIN?this.quantityIn[e].quantityIN+this.lastInventoryObject[e].lastQuantityIn-t.quantityOut:this.lastInventoryObject[e].lastQuantityIn-t.quantityOut:this.quantityIn[e]&&this.quantityIn[e].quantityIN?this.quantityIn[e].quantityIN-t.quantityOut:t.quantityOut):(t.quantityOut=0,t.nextQuantityIn=this.lastInventoryObject[e]&&this.lastInventoryObject[e].lastQuantityIn?this.quantityIn[e]&&this.quantityIn[e].quantityIN?this.quantityIn[e].quantityIN+this.lastInventoryObject[e].lastQuantityIn:this.lastInventoryObject[e].lastQuantityIn:this.quantityIn[e]&&this.quantityIn[e].quantityIN?this.quantityIn[e].quantityIN:0)}),e(t)})}transformLastInventoryArrayInObject(t){console.log(t),t.forEach(t=>{let e=t.prod._id;t.nextQuantityIn?(console.log(t.nextQuantityIn),this.lastInventoryObject[e]={lastQuantityIn:t.nextQuantityIn}):this.lastInventoryObject[e]={lastQuantityIn:0}}),console.log("dernier inventaire===",this.lastInventoryObject)}manageResource(t,e){if("out"===e){let e=t.item._id;this.resourceOut[e]=this.resourceOut[e]?{resourceList:t.item.resourceList,qty:t.qty+this.resourceOut[e].qty,prod:t.item}:{resourceList:t.item.resourceList,qty:t.qty,prod:t.item}}if("in"===e){let e=t.item._id;this.resourceIn[e]=this.resourceOut[e]?{resourceList:t.item.resourceList,qty:t.qty+this.resourceOut[e].qty,prod:t.item}:{resourceList:t.item.resourceList,qty:t.qty,prod:t.item}}console.log(this.resourceIn)}}return t.\u0275fac=function(e){return new(e||t)(c.Y36(l.e),c.Y36(s.IN),c.Y36(s.Br),c.Y36(s.BX),c.Y36(s.yF),c.Y36(s.HT),c.Y36(u.sk),c.Y36(a.F0),c.Y36(d.w),c.Y36(h.l),c.Y36(h.l),c.Y36(g.sK),c.Y36(m.l),c.Y36(p.i),c.Y36(b.w),c.Y36(y.g),c.Y36(f.a),c.Y36(I.i),c.Y36(i.Ye),c.Y36(O.i))},t.\u0275cmp=c.Xpm({type:t,selectors:[["app-before-inventory"]],viewQuery:function(t,e){if(1&t&&(c.Gf(q,1,c.SBq),c.Gf(v,1,c.SBq),c.Gf(s.pK,1)),2&t){let t;c.iGM(t=c.CRH())&&(e.nbrCassier=t.first),c.iGM(t=c.CRH())&&(e.nbrBtl=t.first),c.iGM(t=c.CRH())&&(e.inputs=t)}},decls:30,vars:8,consts:[["slot","start"],["defaultHref","/inventaire-list"],["color","tertiary","scrollable","",3,"ngModel","ionChange","ngModelChange",4,"ngIf"],["color","primary",3,"hidden"],["size-sm","2","size-md","2","size-xm","2","size-lg","2",1,"ion-align-self-center"],[1,"ion-text-center","ion-text-uppercase"],["size-sm","4","size-md","4","size-xm","4","size-lg","4",1,"ion-align-self-center"],[3,"hidden","ngStyle",4,"ngFor","ngForOf"],["size","block","color","warning",3,"hidden","click"],["color","tertiary","scrollable","",3,"ngModel","ionChange","ngModelChange"],["value","product","checked","",4,"ngIf"],["value","productResto",4,"ngIf"],["value","service",4,"ngIf"],["value","product","checked",""],["value","productResto"],["value","service"],[3,"hidden","ngStyle"],[1,"ion-text-start","ion-text-uppercase"],["slot","end","placeholder","casier","type","number","debounce","700",3,"ngStyle","ionChange"],["nbrCassier",""],["slot","end","placeholder","bouteille","type","number","debounce","700",3,"ngStyle","ionChange"],["nbrBtl",""],["size-sm","1","size-md","1","size-xm","1","size-lg","1",1,"ion-align-self-center"],["size-sm","3","size-md","3","size-xm","3","size-lg","3",1,"ion-align-self-center"],["slot","end","placeholder","Enter quantity","type","number","debounce","2000",3,"ionChange"]],template:function(t,e){1&t&&(c.TgZ(0,"ion-header"),c.TgZ(1,"ion-toolbar"),c.TgZ(2,"ion-buttons",0),c._UZ(3,"ion-back-button",1),c.qZA(),c.qZA(),c.qZA(),c.TgZ(4,"ion-content"),c.YNc(5,Z,4,4,"ion-segment",2),c.TgZ(6,"ion-row",3),c.TgZ(7,"ion-col",4),c.TgZ(8,"div",5),c._uU(9),c.ALo(10,"translate"),c.qZA(),c.qZA(),c.TgZ(11,"ion-col",4),c._UZ(12,"div",5),c.qZA(),c.TgZ(13,"ion-col",6),c.TgZ(14,"div",5),c._uU(15,"cas"),c.qZA(),c.qZA(),c.TgZ(16,"ion-col",6),c.TgZ(17,"div",5),c._uU(18,"btls"),c.qZA(),c.qZA(),c.qZA(),c.YNc(19,x,14,11,"ion-row",7),c.YNc(20,M,9,5,"ion-row",7),c.TgZ(21,"ion-row"),c.TgZ(22,"ion-col",6),c._UZ(23,"div",5),c.qZA(),c.TgZ(24,"ion-col",6),c.TgZ(25,"div",5),c.TgZ(26,"ion-button",8),c.NdJ("click",function(){return e.launchAll()}),c._uU(27," sumbmit "),c.qZA(),c.qZA(),c.qZA(),c.TgZ(28,"ion-col",6),c._UZ(29,"div",5),c.qZA(),c.qZA(),c.qZA()),2&t&&(c.xp6(5),c.Q6J("ngIf",e.storeTypes.length>1),c.xp6(1),c.Q6J("hidden",e.btnService),c.xp6(3),c.hij(" ",c.lcZ(10,6,"MENU.name")," "),c.xp6(10),c.Q6J("ngForOf",e.productsItem),c.xp6(1),c.Q6J("ngForOf",e.productResto),c.xp6(6),c.Q6J("hidden",e.btnService))},directives:[s.Gu,s.sr,s.Sm,s.oU,s.cs,s.W2,i.O5,s.Nd,s.wI,i.sg,s.YG,s.cJ,s.QI,o.JJ,o.On,s.GO,s.Q$,i.PC,s.pK,s.as],pipes:[g.X$],styles:[".instock[_ngcontent-%COMP%], .instore[_ngcontent-%COMP%]{font-size:60%;font-weight:700}.instore[_ngcontent-%COMP%]{color:#1c74f7}.btnWarehouse[_ngcontent-%COMP%]{font-size:50%}.stock-alert[_ngcontent-%COMP%]{--ion-background-color:#f85252;--color:#fff;opacity:.9}.stock-alert[_ngcontent-%COMP%]   .instock[_ngcontent-%COMP%], .stock-alert[_ngcontent-%COMP%]   .instore[_ngcontent-%COMP%]{color:#fff}.stock-alert[_ngcontent-%COMP%]   .btnWarehouse[_ngcontent-%COMP%]{--border-color:#000;--color:#000}.confirm[_ngcontent-%COMP%]{padding:0;color:red;font-size:10px}.divG[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.center[_ngcontent-%COMP%]{text-align:center;padding:20px 0;font-size:20px;background-color:#f1f1f1}.center[_ngcontent-%COMP%], ion-label[_ngcontent-%COMP%]{text-transform:uppercase}ion-label[_ngcontent-%COMP%]{font-size:13px}ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:15px}ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], span[_ngcontent-%COMP%]{text-transform:uppercase}span[_ngcontent-%COMP%]{text-align:center;background-color:#f56276;font-size:10px;display:block}ion-item[_ngcontent-%COMP%]{font-size:12px}ion-col[_ngcontent-%COMP%]   .inte[_ngcontent-%COMP%], ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:10px;text-transform:uppercase}.data-lastrow[_ngcontent-%COMP%]{background-color:#f1f1f1}.data-lastrow[_ngcontent-%COMP%], .header-row[_ngcontent-%COMP%]{padding-top:10px;padding-bottom:10px}.header-row[_ngcontent-%COMP%]{background-color:#263bf5}.first[_ngcontent-%COMP%]{display:block;display:flex}.first[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1;border:1px solid #f1f1f1;margin:15px}.second[_ngcontent-%COMP%]{display:flex}.second[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1;border:1px solid #f1f1f1;margin:15px}.third[_ngcontent-%COMP%]{display:flex}.third[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1;border:1px solid #f1f1f1;margin-top:15px;height:200px}.icone[_ngcontent-%COMP%]{font-size:30px;border:1px solid #032f72}.inte[_ngcontent-%COMP%]{font-size:15px}.allIcone[_ngcontent-%COMP%]{display:flex}.allIcone[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1}.divecol[_ngcontent-%COMP%]{display:flex}.divecol[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{flex-grow:1;text-align:center;font-size:13px}.divecol[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], .total[_ngcontent-%COMP%]{font-weight:700}.separationBlock[_ngcontent-%COMP%]{height:10px;padding:0;margin:0}"]}),t})()}];let k=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[a.Bz.forChild(T)],a.Bz]}),t})(),A=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[i.ez,o.u5,s.Pc,k,g.aw.forChild()]]}),t})()},866:(t,e,n)=>{"use strict";n.d(e,{l:()=>c});var i=n(529),o=n(1036),s=n(1572),a=n(9063),r=n(2968);let c=(()=>{class t{constructor(t,e){this.http=t,this.urlService=e,this.url="http://192.168.100.10:3000/",this.takeUrl()}takeUrl(){i.N.production?this.urlService.getUrl().subscribe(t=>{this.url=t,console.log("url",this.url)}):this.url=i.V}updateProductItemStore(t){return this.id=localStorage.getItem("adminId"),this.database=localStorage.getItem("adminemail"),this.http.patch(`${this.url}productsitem/${this.id}/products/store?db=${this.id}`,t)}updateProductItemStore1(t){return this.id=localStorage.getItem("adminId"),this.database=localStorage.getItem("adminemail"),this.http.put(`${this.url}productsitem/${this.id}/products/store?db=${this.id}`,t)}confirmProductItemStore(t){this.id=localStorage.getItem("adminId"),this.database=localStorage.getItem("adminemail");let e="";if(localStorage.getItem("openCashDateId")?e=localStorage.getItem("openCashDateId"):JSON.parse(localStorage.getItem("openCashDateObj"))&&(e=JSON.parse(localStorage.getItem("openCashDateObj"))._id),e)return this.http.patch(`${this.url}productsitem/${this.id}/products/store/confirm?db=${this.id}&openCashDate=${e}`,t)}updateManufacturedItemStore(t){this.id=localStorage.getItem("adminId");let e=localStorage.getItem("openCashDateId");return this.database=localStorage.getItem("adminemail"),this.http.patch(`${this.url}products_resto_item/${this.id}/manufacturedItems/store?db=${this.id}&openCashDate=${e}`,t).pipe()}updateManufacturedItemStoreConfirm(t){this.id=localStorage.getItem("adminId"),this.database=localStorage.getItem("adminemail");let e=localStorage.getItem("openCashDateId");return this.http.patch(`${this.url}products_resto_item/${this.id}/manufacturedItems/store/confirm?db=${this.id}&openCashDate=${e}`,t).pipe()}updateIce(t){return this.id=localStorage.getItem("adminId"),this.database=localStorage.getItem("adminemail"),this.http.patch(`${this.url}productsitem/${this.id}/products/store/confirm/glacer?db=${this.id}`,t)}setProductItem(t){console.log(t),this.product=t}getProductItem(){return(0,o.isNullOrUndefined)(this.product)?0:this.product}}return t.\u0275fac=function(e){return new(e||t)(s.LFG(a.eN),s.LFG(r.i))},t.\u0275prov=s.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);