(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[9205],{9205:(e,i,t)=>{"use strict";t.r(i),t.d(i,{GammeAddPageModule:()=>S});var n=t(1511),o=t(6073),r=t(8158),s=t(8777),a=t(4762),c=t(2034),l=t(3685),g=t(1572),d=t(2874),m=t(1714),u=t(4375);const Z=["form"];function p(e,i){if(1&e&&(g.TgZ(0,"ion-card"),g._UZ(1,"img",15),g.qZA()),2&e){const e=g.oxw();g.xp6(1),g.Q6J("src",e.url,g.LSH)}}function f(e,i){if(1&e&&(g.TgZ(0,"ion-select-option",18),g._uU(1),g.qZA()),2&e){const e=i.$implicit;g.s9C("value",e.id),g.xp6(1),g.Oqu(e.name)}}function h(e,i){if(1&e){const e=g.EpF();g.TgZ(0,"ion-item"),g.TgZ(1,"ion-label"),g._uU(2,"ADD STORE"),g.qZA(),g.TgZ(3,"ion-select",16),g.NdJ("ionChange",function(i){return g.CHM(e),g.oxw().assignStore(i)}),g.YNc(4,f,2,2,"ion-select-option",17),g.qZA(),g.qZA()}if(2&e){const e=g.oxw();g.xp6(4),g.Q6J("ngForOf",e.userStore)}}function q(e,i){if(1&e){const e=g.EpF();g.TgZ(0,"ion-item",19),g.NdJ("click",function(){return g.CHM(e),g.oxw().pickResource()}),g._UZ(1,"ion-icon",20),g.TgZ(2,"ion-label"),g._uU(3,"Products"),g.qZA(),g.qZA()}}const A=function(e){return{"background-color":e}};function T(e,i){if(1&e){const e=g.EpF();g.TgZ(0,"ion-row",21,22),g.TgZ(2,"ion-col",10),g.TgZ(3,"div",11),g._uU(4),g.qZA(),g.qZA(),g.TgZ(5,"ion-col",10),g.TgZ(6,"div",11),g._uU(7),g.qZA(),g.qZA(),g.TgZ(8,"ion-col",12),g.TgZ(9,"div",11),g.TgZ(10,"ion-input",23),g.NdJ("ionChange",function(t){g.CHM(e);const n=i.$implicit,o=i.index;return g.oxw().addQuantity(t,n,o)}),g.qZA(),g.qZA(),g.qZA(),g.TgZ(11,"ion-col",12),g.TgZ(12,"div",11),g.TgZ(13,"ion-button",24),g.NdJ("click",function(){g.CHM(e);const t=i.$implicit;return g.oxw().remove(t)}),g._UZ(14,"ion-icon",25),g.qZA(),g.qZA(),g.qZA(),g.qZA()}if(2&e){const e=i.$implicit;g.Q6J("ngStyle",g.VKq(3,A,i.index%2==0?"#f1f1f1":"white")),g.xp6(4),g.Oqu(e.name),g.xp6(3),g.Oqu(e.sellingPrice)}}const v=[{path:"",component:(()=>{class e{constructor(e,i,t,n,o,r,s){this.modalController=e,this.toastController=i,this.loadingController=t,this.router=n,this.notifi=o,this.gammeService=r,this.random=s,this.userStore=[]}ngOnInit(){this.init();let e=JSON.parse(localStorage.getItem("user"));this.userStore=e[0].storeId,1==this.userStore.length&&(this.storeId=this.userStore[0].id)}addGamme(e){if(this.formulaire.invalid)this.notifi.presentFormError("formulaire invalide.!","danger");else{this.notifi.presentLoading(),this.gamme.name=e.value.name,this.gamme.sellingPrice=e.value.sellingPrice,delete this.gamme._id;var i=new FormData;i.append("name",this.gamme.name),i.append("sellingPrice",e.value.sellingPrice),i.append("productList",JSON.stringify(this.gamme.productList)),i.append("storeId",this.storeId),i.append("image",this.file),this.gammeService.postGamme(i).subscribe(i=>{console.log(i),e.reset(),this.notifi.dismissLoading(),this.notifi.presentToast("save successfuly!!!","primary"),this.gamme.productList.forEach(e=>{this.remove(e)})},e=>{this.notifi.dismissLoading()})}}init(){this.gamme=new c.R("",[],0,""),console.log(this.gamme)}pickResource(){return(0,a.mG)(this,void 0,void 0,function*(){this.gammeService.setGamme(this.gamme),this.random.setStoreId(this.storeId);const e=yield this.modalController.create({component:l.E,componentProps:{}});return e.onDidDismiss().then(e=>{this.gamme=this.gammeService.getGamme()}),yield e.present()})}closeModal(){}remove(e){this.gamme.removeToProductList(e)}addQuantity(e,i,t){let n=parseInt(e.detail.value);console.log(Number.isNaN(n)),this.gamme.productList[t].toRemove=Number.isNaN(n)?1:n,console.log(this.gamme.productList)}readUrl(e){if(this.file=e.target.files[0],e.target.files&&e.target.files[0]){var i=new FileReader;i.onload=e=>{this.url=e.target.result},i.readAsDataURL(e.target.files[0])}}assignStore(e){return(0,a.mG)(this,void 0,void 0,function*(){console.log(e.target.value),this.storeId=e.target.value})}}return e.\u0275fac=function(i){return new(i||e)(g.Y36(r.IN),g.Y36(r.yF),g.Y36(r.HT),g.Y36(s.F0),g.Y36(d.g),g.Y36(m.K),g.Y36(u.i))},e.\u0275cmp=g.Xpm({type:e,selectors:[["app-gamme-add"]],viewQuery:function(e,i){if(1&e&&g.Gf(Z,1,o.F),2&e){let e;g.iGM(e=g.CRH())&&(i.formulaire=e.first)}},decls:38,vars:5,consts:[["slot","start"],["defaultHref","/start"],[4,"ngIf"],[3,"ngSubmit"],["form","ngForm"],["name","name","type","text","placeholder","Name","ngModel","","required",""],["name","sellingPrice","type","number","placeholder","prix de vente","ngModel","","required",""],["name","image","type","file","ngModel","","required","",3,"change"],["button","",3,"click",4,"ngIf"],[1,"header-row"],["size","4",1,"ion-align-self-center"],[1,"ion-text-center"],["size","2",1,"ion-align-self-center"],["class","data-row data-update",3,"ngStyle",4,"ngFor","ngForOf"],["color","danger","size","large","type","submit","expand","block",3,"disabled"],[3,"src"],["cancelText","cancel","okText","Okay","interface","popover",3,"ionChange"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],["button","",3,"click"],["slot","end","name","add-circle-outline"],[1,"data-row","data-update",3,"ngStyle"],["itemlist",""],["debounce","500","type","number","placeholder","quantity",3,"ionChange"],["color","danger","size","small",3,"click"],["slot","icon-only","name","trash"]],template:function(e,i){if(1&e){const e=g.EpF();g.TgZ(0,"ion-header"),g.TgZ(1,"ion-toolbar"),g.TgZ(2,"ion-buttons",0),g._UZ(3,"ion-back-button",1),g.qZA(),g.qZA(),g.qZA(),g.TgZ(4,"ion-content"),g.YNc(5,p,2,1,"ion-card",2),g.TgZ(6,"form",3,4),g.NdJ("ngSubmit",function(){g.CHM(e);const t=g.MAs(7);return i.addGamme(t)}),g.TgZ(8,"ion-grid"),g.TgZ(9,"ion-row"),g.TgZ(10,"ion-col"),g.TgZ(11,"div"),g.TgZ(12,"ion-item"),g._UZ(13,"ion-input",5),g.qZA(),g.TgZ(14,"ion-item"),g._UZ(15,"ion-input",6),g.qZA(),g.YNc(16,h,5,1,"ion-item",2),g.TgZ(17,"ion-item"),g.TgZ(18,"ion-input",7),g.NdJ("change",function(e){return i.readUrl(e)}),g.qZA(),g.qZA(),g.YNc(19,q,4,0,"ion-item",8),g.TgZ(20,"ion-row",9),g.TgZ(21,"ion-col",10),g.TgZ(22,"div",11),g._uU(23,"Name"),g.qZA(),g.qZA(),g.TgZ(24,"ion-col",10),g.TgZ(25,"div",11),g._uU(26,"Price"),g.qZA(),g.qZA(),g.TgZ(27,"ion-col",12),g.TgZ(28,"div",11),g._uU(29,"Quantity"),g.qZA(),g.qZA(),g.TgZ(30,"ion-col",12),g._UZ(31,"div",11),g.qZA(),g.qZA(),g.YNc(32,T,15,5,"ion-row",13),g.qZA(),g.qZA(),g.qZA(),g.TgZ(33,"ion-row"),g.TgZ(34,"ion-col"),g.TgZ(35,"div",11),g.TgZ(36,"ion-button",14),g._uU(37,"Register"),g.qZA(),g.qZA(),g.qZA(),g.qZA(),g.qZA(),g.qZA(),g.qZA()}if(2&e){const e=g.MAs(7);g.xp6(5),g.Q6J("ngIf",i.url),g.xp6(11),g.Q6J("ngIf",i.userStore.length>1),g.xp6(3),g.Q6J("ngIf",i.storeId),g.xp6(13),g.Q6J("ngForOf",i.gamme.productList),g.xp6(4),g.Q6J("disabled",e.invalid||0==i.gamme.productList.length)}},directives:[r.Gu,r.sr,r.Sm,r.oU,r.cs,r.W2,n.O5,o.Y7,o.JL,o.F,r.jY,r.Nd,r.wI,r.Ie,r.pK,r.j9,o.JJ,o.On,o.Q7,r.as,n.sg,r.YG,r.PM,r.Q$,r.t9,r.QI,r.n0,r.gu,n.PC],styles:[""]}),e})()}];let b=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=g.oAB({type:e}),e.\u0275inj=g.cJS({imports:[[s.Bz.forChild(v)],s.Bz]}),e})(),S=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=g.oAB({type:e}),e.\u0275inj=g.cJS({imports:[[n.ez,o.u5,r.Pc,b]]}),e})()}}]);