(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[8661],{8661:(e,t,i)=>{"use strict";i.r(t),i.d(t,{AddProductListPageModule:()=>m});var a=i(1511),o=i(6073),n=i(8158),r=i(8777),c=i(1572),s=i(4144),d=i(2874),l=i(5897),g=i(2426);function u(e,t){if(1&e&&(c.TgZ(0,"ion-select-option",23),c._uU(1),c.qZA()),2&e){const e=t.$implicit;c.s9C("value",e._id),c.xp6(1),c.Oqu(e.name)}}const p=[{path:"",component:(()=>{class e{constructor(e,t,i,a){this.restApi=e,this.notif=t,this.categorieSerice=i,this.createPack=a,this.getCategories(),console.log(JSON.parse(localStorage.getItem("setting")))}ngOnInit(){}getCategories(){this.categorieSerice.getMarieCategories().subscribe(e=>{console.log(e),this.categorys=e.category})}savProduct(e){console.log(e.value),this.sendToServer(e.value)}sendToServer(e){let t=JSON.parse(localStorage.getItem("user"))[0];e.storeId=t.storeId[0].id,this.restApi.addProductFromMaeri(e).subscribe(t=>{t.data.productId=t.data._id,delete t.data._id,delete t.data.productitems,delete t.data.filename,delete t.data.originalName,delete t.data.lemballus,delete t.data.originalName,delete t.data.storeId,t.data.sizeUnit&&(t.data.sizeUnitProduct=t.data.sizeUnit),t.data.unitName&&(t.data.unitNameProduct=t.data.unitName);let i=JSON.parse(localStorage.getItem("setting"))[0],a=[];a=JSON.parse(localStorage.getItem("user"))[0].storeId,t.data.storeId=a[0].id,this.restApi.addProductItem(t.data).subscribe(t=>{console.log(t),t.data.packSize=e.packSize,t.data.packPrice=e.packPrice,this.createPack.registerPack(t.data,t.data.productId,t.data._id)}),i.multi_store&&a.slice(1).forEach(i=>{console.log(i.id),t.data.storeId=i.id,this.restApi.addProductItem(t.data).subscribe(t=>{console.log(t),t.data.packSize=e.packSize,t.data.packPrice=e.packPrice,this.createPack.registerPack(t.data,t.data.productId,t.data._id)})})})}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(s.e),c.Y36(d.g),c.Y36(l.q),c.Y36(g.I))},e.\u0275cmp=c.Xpm({type:e,selectors:[["app-add-product-list"]],decls:55,vars:2,consts:[["color","light"],["slot","start"],["defaultHref","/add-product-list"],[3,"ngSubmit"],["form","ngForm"],["color","primary","justify-content-center",""],["align-self-center","","size-md","6","size-lg","5","size-xs","12"],["padding",""],["position","floating"],["name","name","type","text","placeholder","nom","ngModel","","required",""],["interface","popover","ngModel","","name","categoryId"],[3,"value",4,"ngFor","ngForOf"],["name","purchasingPrice","type","text","ngModel","","required","","placeholder","purchasing Price"],["name","sellingPrice","type","text","ngModel","","required","","placeholder","selling Price"],["name","sizeUnit","type","number","placeholder","size","ngModel","","required",""],["interface","popover","ngModel","","name","unitName"],["value","g"],["value","kg"],["value","cl"],["value","l"],["name","packSize","type","number","placeholder","pack siize","ngModel","","required",""],["name","packPrice","type","number","placeholder","pack price","ngModel","","required",""],["color","danger","size","large","type","submit","expand","block",3,"disabled"],[3,"value"]],template:function(e,t){if(1&e){const e=c.EpF();c.TgZ(0,"ion-header"),c.TgZ(1,"ion-toolbar",0),c.TgZ(2,"ion-buttons",1),c._UZ(3,"ion-back-button",2),c.qZA(),c.qZA(),c.qZA(),c.TgZ(4,"ion-content"),c.TgZ(5,"form",3,4),c.NdJ("ngSubmit",function(){c.CHM(e);const i=c.MAs(6);return t.savProduct(i)}),c.TgZ(7,"ion-grid"),c.TgZ(8,"ion-row",5),c.TgZ(9,"ion-col",6),c.TgZ(10,"div",7),c.TgZ(11,"ion-item"),c.TgZ(12,"ion-label",8),c._uU(13,"Nom du produit"),c.qZA(),c._UZ(14,"ion-input",9),c.qZA(),c.TgZ(15,"ion-item"),c.TgZ(16,"ion-label"),c._uU(17,"Category"),c.qZA(),c.TgZ(18,"ion-select",10),c.YNc(19,u,2,2,"ion-select-option",11),c.qZA(),c.qZA(),c.TgZ(20,"ion-item"),c.TgZ(21,"ion-label",8),c._uU(22,"prix d'achat"),c.qZA(),c._UZ(23,"ion-input",12),c.qZA(),c.TgZ(24,"ion-item"),c.TgZ(25,"ion-label",8),c._uU(26,"prix de vente"),c.qZA(),c._UZ(27,"ion-input",13),c.qZA(),c.TgZ(28,"ion-item"),c.TgZ(29,"ion-label",8),c._uU(30,"product size"),c.qZA(),c._UZ(31,"ion-input",14),c.qZA(),c.TgZ(32,"ion-item"),c.TgZ(33,"ion-label"),c._uU(34,"choose unit"),c.qZA(),c.TgZ(35,"ion-select",15),c.TgZ(36,"ion-select-option",16),c._uU(37,"g"),c.qZA(),c.TgZ(38,"ion-select-option",17),c._uU(39,"kg"),c.qZA(),c.TgZ(40,"ion-select-option",18),c._uU(41,"cl"),c.qZA(),c.TgZ(42,"ion-select-option",19),c._uU(43,"l"),c.qZA(),c.qZA(),c.qZA(),c.TgZ(44,"ion-item"),c.TgZ(45,"ion-label",8),c._uU(46,"pack size"),c.qZA(),c._UZ(47,"ion-input",20),c.qZA(),c.TgZ(48,"ion-item"),c.TgZ(49,"ion-label",8),c._uU(50,"pack price"),c.qZA(),c._UZ(51,"ion-input",21),c.qZA(),c.qZA(),c.TgZ(52,"div",7),c.TgZ(53,"ion-button",22),c._uU(54,"Register"),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA(),c.qZA()}if(2&e){const e=c.MAs(6);c.xp6(19),c.Q6J("ngForOf",t.categorys),c.xp6(34),c.Q6J("disabled",e.invalid)}},directives:[n.Gu,n.sr,n.Sm,n.oU,n.cs,n.W2,o.Y7,o.JL,o.F,n.jY,n.Nd,n.wI,n.Ie,n.Q$,n.pK,n.j9,o.JJ,o.On,o.Q7,n.t9,n.QI,a.sg,n.as,n.n0,n.YG],styles:[""]}),e})()}];let Z=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[r.Bz.forChild(p)],r.Bz]}),e})(),m=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[a.ez,o.u5,n.Pc,Z]]}),e})()}}]);