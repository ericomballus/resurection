(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[1419],{1419:(e,t,o)=>{"use strict";o.d(t,{J:()=>S});var i=o(4762),n=o(1572),s=o(529),r=o(7207),a=o(6073),c=o(3575),l=o(4144),g=o(8158),u=o(5897),d=o(1611),p=o(2968),h=o(2426),Z=o(2874),f=o(1511),m=o(1064);const v=["form"],q=["itemlist"],A=["totalCoaste"];function y(e,t){if(1&e&&(n.TgZ(0,"ion-card"),n._UZ(1,"img",26),n.qZA()),2&e){const e=n.oxw();n.xp6(1),n.Q6J("src",e.url,n.LSH)}}function T(e,t){if(1&e&&(n.TgZ(0,"ion-select-option",27),n._uU(1),n.qZA()),2&e){const e=t.$implicit;n.s9C("value",e._id),n.xp6(1),n.Oqu(e.name)}}function C(e,t){if(1&e&&(n.TgZ(0,"ion-select-option",27),n._uU(1),n.qZA()),2&e){const e=t.$implicit;n.s9C("value",e.id),n.xp6(1),n.Oqu(e.name)}}function b(e,t){if(1&e){const e=n.EpF();n.TgZ(0,"ion-item"),n.TgZ(1,"ion-label"),n._uU(2),n.ALo(3,"translate"),n.qZA(),n.TgZ(4,"ion-select",28),n.NdJ("ionChange",function(t){return n.CHM(e),n.oxw().assignStore(t)}),n.YNc(5,C,2,2,"ion-select-option",18),n.qZA(),n.qZA()}if(2&e){const e=n.oxw();n.xp6(2),n.Oqu(n.lcZ(3,2,"MENU.store")),n.xp6(3),n.Q6J("ngForOf",e.userStore)}}function _(e,t){1&e&&(n.TgZ(0,"ion-row",29),n.TgZ(1,"ion-col",30),n.TgZ(2,"div",31),n._uU(3),n.ALo(4,"translate"),n.qZA(),n.qZA(),n.TgZ(5,"ion-col",30),n.TgZ(6,"div",31),n._uU(7),n.ALo(8,"translate"),n.qZA(),n.qZA(),n.TgZ(9,"ion-col",30),n.TgZ(10,"div",31),n._uU(11),n.ALo(12,"translate"),n.qZA(),n.qZA(),n.TgZ(13,"ion-col",30),n.TgZ(14,"div",31),n._uU(15),n.ALo(16,"translate"),n.qZA(),n.qZA(),n.qZA()),2&e&&(n.xp6(3),n.Oqu(n.lcZ(4,4,"MENU.name")),n.xp6(4),n.hij(" ",n.lcZ(8,6,"MENU.quantity")," "),n.xp6(4),n.Oqu(n.lcZ(12,8,"MENU.unit")),n.xp6(4),n.Oqu(n.lcZ(16,10,"MENU.coast")))}const x=function(e){return{"background-color":e}};function U(e,t){if(1&e&&(n.TgZ(0,"ion-row",32,33),n.TgZ(2,"ion-col",30),n.TgZ(3,"div",31),n._uU(4),n.qZA(),n.qZA(),n.TgZ(5,"ion-col",30),n.TgZ(6,"div",31),n._uU(7),n.qZA(),n.qZA(),n.TgZ(8,"ion-col",30),n.TgZ(9,"div",31),n._uU(10),n.qZA(),n.qZA(),n.TgZ(11,"ion-col",30),n.TgZ(12,"div",31),n._uU(13),n.ALo(14,"currency"),n.qZA(),n.qZA(),n.qZA()),2&e){const e=t.$implicit;n.Q6J("ngStyle",n.VKq(10,x,t.index%2==0?"#f1f1f1":"white")),n.xp6(4),n.Oqu(e.name),n.xp6(3),n.Oqu(e.quantity),n.xp6(3),n.Oqu(e.unitName),n.xp6(3),n.hij(" ",n.gM2(14,5,e.coast,"CFA","symbol","3.0-0")," ")}}function M(e,t){if(1&e&&(n.TgZ(0,"ion-row",34),n.TgZ(1,"ion-col",35),n._UZ(2,"div",36),n.qZA(),n.TgZ(3,"ion-col",37),n._UZ(4,"div",31),n.qZA(),n.TgZ(5,"ion-col",30),n.TgZ(6,"div",38),n._uU(7),n.ALo(8,"currency"),n.qZA(),n.qZA(),n.TgZ(9,"ion-col",37),n._UZ(10,"div",31),n.qZA(),n.qZA()),2&e){const e=n.oxw();n.xp6(7),n.hij(" ",n.gM2(8,1,e.totalCoast,"CFA","symbol","3.0-0")," ")}}let S=(()=>{class e{constructor(e,t,o,i,n,s,r,a,c,l,g){if(this.madebyService=e,this.restApi=t,this.modalController=o,this.toastController=i,this.loadingController=n,this.catService=s,this.resourceService=r,this.urlService=a,this.createPack=c,this.animationCtrl=l,this.notifi=g,this.totalCoast=0,this.tabRoles=[],this.admin=!1,this.userStore=[],this.tabRoles=JSON.parse(localStorage.getItem("roles")),this.tabRoles.includes(1)){this.getCategories(),this.getMade(),this.admin=!0;let e=JSON.parse(localStorage.getItem("user"));this.userStore=e[0].storeId,this.storeID=this.userStore[0].id.toString(),console.log(this.storeID)}}ngOnInit(){}takeUrl(){s.N.production?this.urlService.getUrl().subscribe(e=>{this.url=e}):this.url=s.V}getCategories(){this.catService.getCategories().subscribe(e=>{console.log(e),this.categorys=e.category.filter(e=>{if(e.page)return e.page==this.page}),this.getSupCategories()})}getSupCategories(){this.catService.getCategoriesSup().subscribe(e=>{console.log(e),this.supcategories=e.category})}getMade(){this.madebyService.getMarieMadeby().subscribe(e=>{console.log(e),this.mades=e.madeby})}test(e){console.log(e),console.log(e.target.value),this.productId=e.target.value,this.categorystab=this.categorys.filter(e=>e._id===this.productId)[0],console.log(this.categorystab)}test2(e){console.log(e),console.log(e.target.value),this.supcatId=e.target.value,this.categorystabSup=this.supcatId,console.log(this.categorystabSup)}made(e){this.madeselect=this.mades.filter(t=>t._id===e.target.value)[0].name}readUrl(e){if(this.file=e.target.files[0],e.target.files&&e.target.files[0]){var t=new FileReader;t.onload=e=>{this.url=e.target.result},t.readAsDataURL(e.target.files[0])}}register(e){return(0,i.mG)(this,void 0,void 0,function*(){if(this.formulaire.invalid)return void this.notifi.presentFormError("formulaire invalide.!","danger");this.presentLoading();var t=new FormData;yield t.append("categoryId",this.categorystab._id),yield t.append("categoryName",this.categorystab.name),yield t.append("name",e.value.name),yield t.append("capacity",e.value.capacity),yield t.append("sellingPrice",e.value.sellingPrice),yield t.append("description",e.value.description),t.append("superCategory","bar"),e.value.packPrice?yield t.append("packPrice",e.value.packPrice):yield t.append("packPrice","0"),e.value.packSize?yield t.append("packSize",e.value.packSize):yield t.append("packSize","1"),t.append("storeId",this.userStore[0].id),this.resourceList&&t.append("resourceList",JSON.stringify(this.resourceList)),e.value.sizeUnit&&t.append("sizeUnit",e.value.sizeUnit),this.unitName&&t.append("unitName",this.unitName),e.value.purchasingPrice?yield t.append("purchasingPrice",e.value.purchasingPrice):yield t.append("purchasingPrice","0"),t.append("image",this.file);let o=localStorage.getItem("company");yield t.append("produceBy",o),this.restApi.addProduct(t,this.storeID).subscribe(e=>{this.dismissLoading(),this.presentToast(),this.modalController.dismiss()})})}takeMaeriProducts(){this.restApi.getMaeriProduct().subscribe(e=>{console.log(e)})}presentLoading(){return(0,i.mG)(this,void 0,void 0,function*(){return this.isLoading=!0,yield this.loadingController.create({duration:6e3}).then(e=>{e.present().then(()=>{this.isLoading||e.dismiss().then(()=>console.log("abort presenting"))})})})}dismissLoading(){return(0,i.mG)(this,void 0,void 0,function*(){return this.isLoading=!1,yield this.loadingController.dismiss().then(()=>console.log("dismissed"))})}presentToast(){return(0,i.mG)(this,void 0,void 0,function*(){(yield this.toastController.create({message:"product have been save.",duration:2e3,position:"top",animated:!0,cssClass:"my-custom-class"})).present()})}unitMeasure(e){this.unitName=e.target.value}closeModal(){this.modalController.dismiss()}getResources(){this.resourceService.getResources().subscribe(e=>{console.log(e),this.resources=e.resources})}pickResource(){return(0,i.mG)(this,void 0,void 0,function*(){console.log("ok");const e=yield this.modalController.create({component:r.j,componentProps:{tabs:this.resourceList,page:"product-list"}});return e.onDidDismiss().then(e=>{console.log(e),this.totalCoast=0,e.data?(this.resourceList=e.data,this.resourceList.forEach(e=>{this.totalCoast=this.totalCoast+e.coast})):this.resourceList&&this.resourceList.length&&this.resourceList.forEach(e=>{this.totalCoast=this.totalCoast+e.coast})}),yield e.present()})}assignStore(e){return(0,i.mG)(this,void 0,void 0,function*(){let t=e.target.value;console.log(t),this.storeID=t})}deleteResource(e,t){console.log(this.totalCoastRef._results);const o=this.animationCtrl.create().addElement(document.querySelector(".totalCoast")).duration(2e3).beforeStyles({opacity:.2}).afterStyles({background:"rgba(0, 255, 0, 0.5)"}).afterClearStyles(["opacity"]).keyframes([{offset:0,transform:"scale(1)"},{offset:.5,transform:"scale(1.5)"},{offset:1,transform:"scale(1)"}]);let i=this.items._results[t].nativeElement;const n=this.animationCtrl.create().addElement(i).duration(800).fromTo("transform","translateX(0px)","translateX(100px)").fromTo("opacity","1","0.2");n.play().then(()=>{}),setTimeout(()=>{n.stop(),this.resourceList=this.resourceList.filter(t=>t.resourceId!==e.resourceId),this.totalCoast=0,this.resourceList.forEach(e=>{this.totalCoast=this.totalCoast+e.coast}),o.play().then(()=>{console.log("total coast load")})},800)}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(c.J),n.Y36(l.e),n.Y36(g.IN),n.Y36(g.yF),n.Y36(g.HT),n.Y36(u.q),n.Y36(d.z),n.Y36(p.i),n.Y36(h.I),n.Y36(g.vB),n.Y36(Z.g))},e.\u0275cmp=n.Xpm({type:e,selectors:[["app-add-cocktail"]],viewQuery:function(e,t){if(1&e&&(n.Gf(v,1,a.F),n.Gf(q,1,n.SBq),n.Gf(A,1,n.SBq)),2&e){let e;n.iGM(e=n.CRH())&&(t.formulaire=e.first),n.iGM(e=n.CRH())&&(t.items=e),n.iGM(e=n.CRH())&&(t.totalCoastRef=e)}},inputs:{page:"page"},decls:58,vars:19,consts:[["slot","start"],[3,"click"],["slot","icon-only","name","close"],[4,"ngIf"],[3,"ngSubmit"],["form","ngForm"],["color","primary"],["padding",""],["name","name","type","text","placeholder","Name","ngModel","","required",""],["position","floating"],["name","sizeUnit","type","number","placeholder","size","ngModel","","required",""],["interface","popover",3,"ionChange"],["value","g"],["value","kg"],["value","cl"],["value","l"],["name","sellingPrice","type","number","placeholder","prix de vente","ngModel","","required",""],["color","warning","interface","popover",3,"ionChange"],[3,"value",4,"ngFor","ngForOf"],["button","",3,"click"],["slot","end","name","add-circle-outline"],["class","header-row",4,"ngIf"],["class","data-row data-update",3,"ngStyle",4,"ngFor","ngForOf"],["class","header-row2",4,"ngIf"],["name","image","type","file","ngModel","","required","",3,"change"],["color","success","size","large","type","submit","expand","block",3,"disabled"],[3,"src"],[3,"value"],["cancelText","cancel","okText","Okay","interface","popover","color","warning",3,"ionChange"],[1,"header-row"],["size","3",1,"ion-align-self-center"],[1,"ion-text-center"],[1,"data-row","data-update",3,"ngStyle"],["itemlist",""],[1,"header-row2"],["size","5",1,"ion-align-self-center"],[1,"ion-text-center","ion-text-uppercase"],["size","2",1,"ion-align-self-center"],[1,"ion-text-center","totalCoast"]],template:function(e,t){if(1&e){const e=n.EpF();n.TgZ(0,"ion-header"),n.TgZ(1,"ion-toolbar"),n.TgZ(2,"ion-buttons",0),n.TgZ(3,"ion-button",1),n.NdJ("click",function(){return t.closeModal()}),n._UZ(4,"ion-icon",2),n.qZA(),n.qZA(),n._UZ(5,"ion-title"),n.qZA(),n.qZA(),n.TgZ(6,"ion-content"),n.YNc(7,y,2,1,"ion-card",3),n.TgZ(8,"form",4,5),n.NdJ("ngSubmit",function(){n.CHM(e);const o=n.MAs(9);return t.register(o)}),n.TgZ(10,"ion-grid"),n.TgZ(11,"ion-row",6),n.TgZ(12,"ion-col"),n.TgZ(13,"div",7),n.TgZ(14,"ion-item"),n._UZ(15,"ion-input",8),n.qZA(),n.TgZ(16,"ion-item"),n.TgZ(17,"ion-label",9),n._uU(18),n.ALo(19,"translate"),n.qZA(),n._UZ(20,"ion-input",10),n.qZA(),n.TgZ(21,"ion-item"),n.TgZ(22,"ion-label"),n._uU(23),n.ALo(24,"translate"),n.qZA(),n.TgZ(25,"ion-select",11),n.NdJ("ionChange",function(e){return t.unitMeasure(e)}),n.TgZ(26,"ion-select-option",12),n._uU(27,"g"),n.qZA(),n.TgZ(28,"ion-select-option",13),n._uU(29,"kg"),n.qZA(),n.TgZ(30,"ion-select-option",14),n._uU(31,"cl"),n.qZA(),n.TgZ(32,"ion-select-option",15),n._uU(33,"l"),n.qZA(),n.TgZ(34,"ion-select-option",15),n._uU(35,"piece"),n.qZA(),n.qZA(),n.qZA(),n.TgZ(36,"ion-item"),n._UZ(37,"ion-input",16),n.qZA(),n.TgZ(38,"ion-item"),n.TgZ(39,"ion-label"),n._uU(40),n.ALo(41,"translate"),n.qZA(),n.TgZ(42,"ion-select",17),n.NdJ("ionChange",function(e){return t.test(e)}),n.YNc(43,T,2,2,"ion-select-option",18),n.qZA(),n.qZA(),n.YNc(44,b,6,4,"ion-item",3),n.TgZ(45,"ion-item",19),n.NdJ("click",function(){return t.pickResource()}),n._UZ(46,"ion-icon",20),n.TgZ(47,"ion-label"),n._uU(48,"Resources"),n.qZA(),n.qZA(),n.YNc(49,_,17,12,"ion-row",21),n.YNc(50,U,15,12,"ion-row",22),n.YNc(51,M,11,6,"ion-row",23),n.TgZ(52,"ion-item"),n.TgZ(53,"ion-input",24),n.NdJ("change",function(e){return t.readUrl(e)}),n.qZA(),n.qZA(),n.qZA(),n.TgZ(54,"div",7),n.TgZ(55,"ion-button",25),n._uU(56),n.ALo(57,"translate"),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA()}2&e&&(n.xp6(7),n.Q6J("ngIf",t.url),n.xp6(11),n.Oqu(n.lcZ(19,11,"MENU.size")),n.xp6(5),n.Oqu(n.lcZ(24,13,"MENU.unit")),n.xp6(17),n.Oqu(n.lcZ(41,15,"MENU.category")),n.xp6(3),n.Q6J("ngForOf",t.categorys),n.xp6(1),n.Q6J("ngIf",t.userStore.length>1),n.xp6(5),n.Q6J("ngIf",t.resourceList&&t.resourceList.length),n.xp6(1),n.Q6J("ngForOf",t.resourceList),n.xp6(1),n.Q6J("ngIf",t.resourceList&&t.resourceList.length),n.xp6(4),n.Q6J("disabled",!t.unitName),n.xp6(1),n.Oqu(n.lcZ(57,17,"MENU.save")))},directives:[g.Gu,g.sr,g.Sm,g.YG,g.gu,g.wd,g.W2,f.O5,a.Y7,a.JL,a.F,g.jY,g.Nd,g.wI,g.Ie,g.pK,g.j9,a.JJ,a.On,a.Q7,g.Q$,g.as,g.t9,g.QI,g.n0,f.sg,g.PM,f.PC],pipes:[m.X$,f.H9],styles:[".data-lastrow[_ngcontent-%COMP%]{background-color:#f1f1f1}.data-lastrow[_ngcontent-%COMP%], .header-row[_ngcontent-%COMP%]{padding-top:10px;padding-bottom:10px}.header-row[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:9px}.rowInventaire[_ngcontent-%COMP%]{background-color:#f1f1f1;padding-top:10px;padding-bottom:10px}.rowInventaire[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:9px}.header-row2[_ngcontent-%COMP%]{background-color:#f1f1f1;padding-top:10px;padding-bottom:10px}.header-row2[_ngcontent-%COMP%]   ion-col[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{font-size:13px;background-color:var(--ion-color-dark);color:#fff}"]}),e})()}}]);