(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[9093],{9093:(e,i,n)=>{"use strict";n.r(i),n.d(i,{ScCommandePageModule:()=>f});var t=n(1511),o=n(6073),s=n(8158),a=n(8777),r=n(1572),c=n(4375),g=n(2874),l=n(731),m=n(1064),d=n(3629);function u(e,i){if(1&e){const e=r.EpF();r.TgZ(0,"ion-input",12),r.NdJ("ionChange",function(i){r.CHM(e);const n=r.oxw().index;return r.oxw(2).addValue(i,n)}),r.qZA()}}const h=function(e){return{"background-color":e}},Z=function(e){return[e,"FCFA","symbol","3.0-0","fr"]};function q(e,i){if(1&e&&(r.TgZ(0,"ion-row",8),r.TgZ(1,"ion-col",4),r.TgZ(2,"div",9),r._uU(3),r.qZA(),r.qZA(),r.TgZ(4,"ion-col",6),r.TgZ(5,"div",9),r._uU(6),r.qZA(),r.qZA(),r.TgZ(7,"ion-col",6),r.TgZ(8,"div",9),r._uU(9),r.qZA(),r.qZA(),r.TgZ(10,"ion-col",6),r.TgZ(11,"div",9),r._uU(12),r.qZA(),r.qZA(),r.TgZ(13,"ion-col",6),r.TgZ(14,"div",9),r._uU(15),r.qZA(),r.qZA(),r.TgZ(16,"ion-col",4),r.TgZ(17,"div",9),r.YNc(18,u,1,0,"ion-input",10),r.qZA(),r.qZA(),r.TgZ(19,"ion-col",11),r.TgZ(20,"div",9),r._uU(21),r.qZA(),r.qZA(),r.TgZ(22,"ion-col",6),r.TgZ(23,"div",9),r._uU(24),r.ALo(25,"currency"),r.qZA(),r.qZA(),r.TgZ(26,"ion-col",4),r.TgZ(27,"div",9),r._uU(28),r.ALo(29,"currency"),r.qZA(),r.qZA(),r.qZA()),2&e){const e=i.$implicit,n=i.index,t=r.oxw(2);r.Q6J("ngStyle",r.VKq(23,h,n%2==0?"#f1f1f1":"white")),r.xp6(3),r.hij(" ",e.request.item.name," "),r.xp6(3),r.hij(" ",e.request.qty," "),r.xp6(3),r.hij(" ",e.avaible.quantityItems," "),r.xp6(3),r.hij(" ",e.avaible.reserve?e.avaible.reserve-e.request.qty:0," "),r.xp6(3),r.hij(" ",e.avaible.reserve?e.avaible.quantityItems-(e.avaible.reserve-e.request.qty):0," "),r.xp6(3),r.Q6J("ngIf",!t.originalCommande.scConfirm),r.xp6(1),r.Q6J("ngStyle",r.VKq(25,h,e.reject>0?"var(--ion-color-danger)":e.reject<0?"var(--ion-color-success)":"white")),r.xp6(2),r.hij(" ",e.reject>0?-1*e.reject:e.reject<0?+e.reject:0," "),r.xp6(3),r.hij(" ",r.G7q(25,11,r.VKq(27,Z,e.request.item.sellingPrice))," "),r.xp6(4),r.hij(" ",r.G7q(29,17,r.VKq(29,Z,e.request.item.sellingPrice*e.accept))," ")}}function A(e,i){if(1&e&&(r.TgZ(0,"ion-grid"),r.TgZ(1,"ion-row",3),r.TgZ(2,"ion-col",4),r.TgZ(3,"div",5),r._uU(4,"Name"),r.qZA(),r.qZA(),r.TgZ(5,"ion-col",6),r.TgZ(6,"div",5),r._uU(7,"Demande"),r.qZA(),r.qZA(),r.TgZ(8,"ion-col",6),r.TgZ(9,"div",5),r._uU(10,"Disponible"),r.qZA(),r.qZA(),r.TgZ(11,"ion-col",6),r.TgZ(12,"div",5),r._uU(13,"Reserv\xe9"),r.qZA(),r.qZA(),r.TgZ(14,"ion-col",6),r.TgZ(15,"div",5),r._uU(16,"Reste"),r.qZA(),r.qZA(),r.TgZ(17,"ion-col",4),r._UZ(18,"div",5),r.qZA(),r.TgZ(19,"ion-col",6),r.TgZ(20,"div",5),r._uU(21,"A livr\xe9"),r.qZA(),r.qZA(),r.TgZ(22,"ion-col",6),r.TgZ(23,"div",5),r._uU(24,"prix.U"),r.qZA(),r.qZA(),r.TgZ(25,"ion-col",4),r.TgZ(26,"div",5),r._uU(27,"prix.T"),r.qZA(),r.qZA(),r.qZA(),r.YNc(28,q,30,31,"ion-row",7),r.qZA()),2&e){const e=r.oxw();r.xp6(28),r.Q6J("ngForOf",e.AgenceCommande)}}const p=[{path:"",component:(()=>{class e{constructor(e,i,n,t,o,s){this.random=e,this.notifi=i,this.translateConfigService=n,this.translate=t,this.scService=o,this.location=s,this.AgenceCommande=[]}ngOnInit(){this.languageChanged(),this.AgenceCommande=this.random.getAgenceCommande(),this.originalCommande=this.random.getData(),console.log(this.originalCommande),this.AgenceCommande.forEach(e=>e.request.item.sellingPrice)}languageChanged(){let e=localStorage.getItem("language");e&&this.translateConfigService.setLanguage(e)}addValue(e,i){console.log(e.detail.value),console.log(i);let n=parseInt(e.target.value);n&&n>0&&n<=this.AgenceCommande[i].avaible.quantityItems?(this.AgenceCommande[i].avaible.quantityItems=this.AgenceCommande[i].avaible.quantityItems-n,this.AgenceCommande[i].accept=n,this.AgenceCommande[i].reject=this.AgenceCommande[i].request.qty-n):n&&n>0&&n>this.AgenceCommande[i].avaible.quantityItems?this.notifi.presentToast("la qauntit\xe9 a livrer est sup\xe9rieur a la quantit\xe9 disponible","danger"):(this.AgenceCommande[i].avaible.quantityItems=this.AgenceCommande[i].avaible.quantityItems+this.AgenceCommande[i].accept,this.AgenceCommande[i].accept=0,this.AgenceCommande[i].reject=0)}sendToSuperWareouse(){let e={};this.translate.get("MENU.confirmInvoice").subscribe(i=>{e.confirmInvoice=i}),this.translate.get("MENU.cancel").subscribe(i=>{e.cancel=i}),this.translate.get("MENU.ok").subscribe(i=>{e.ok=i}),this.translate.get("MENU.no").subscribe(i=>{e.no=i}),this.originalCommande.AgenceCommande=this.AgenceCommande,this.originalCommande.scConfirm=!0,this.originalCommande.swConfirm=!1,this.originalCommande.managerConfirm=!1,this.originalCommande.delivery=!1,this.scService.updatePurchase(this.originalCommande).subscribe(e=>{console.log(e),this.notifi.dismissLoading(),this.notifi.presentToast("la commande enregistr\xe9 avaec succ\xe9ss","success"),this.location.back()},e=>{this.notifi.presentToast("une erreur est survenue impossible de continuer cette op\xe9ration","danger"),console.log(e)})}cancelAndUpdate(){this.notifi.presentAlertConfirm("Annuler les changements?","OUI","NON").then(()=>{this.notifi.presentLoading(),this.originalCommande.scConfirm=!1,this.originalCommande.swConfirm=!1,this.originalCommande.managerConfirm=!1,this.originalCommande.delivery=!1,this.originalCommande.restore=!0,this.scService.updatePurchase(this.originalCommande).subscribe(e=>{console.log(e),this.notifi.dismissLoading(),this.notifi.presentToast("la commande enregistr\xe9 avaec succ\xe9ss","success"),this.location.back()},e=>{this.notifi.presentToast("une erreur est survenue impossible de continuer cette op\xe9ration","danger"),console.log(e)})}).catch(()=>{})}}return e.\u0275fac=function(i){return new(i||e)(r.Y36(c.i),r.Y36(g.g),r.Y36(l.w),r.Y36(m.sK),r.Y36(d.A),r.Y36(t.Ye))},e.\u0275cmp=r.Xpm({type:e,selectors:[["app-sc-commande"]],decls:8,vars:1,consts:[["slot","start"],["defaultHref","/sc-home"],[4,"ngIf"],[1,"header-component"],["size-sm","2","size-md","2","size-lg","2"],[1,"ion-text-center"],["size-sm","1","size-md","1","size-lg","1"],["class","data-row data-update","style","font-size: 12px",3,"ngStyle",4,"ngFor","ngForOf"],[1,"data-row","data-update",2,"font-size","12px",3,"ngStyle"],[1,"ion-text-center","ion-text-uppercase","smallSize"],["slot","end","placeholder","quantit\xe9","type","number","debounce","500",3,"ionChange",4,"ngIf"],["size-sm","1","size-md","1","size-lg","1",3,"ngStyle"],["slot","end","placeholder","quantit\xe9","type","number","debounce","500",3,"ionChange"]],template:function(e,i){1&e&&(r.TgZ(0,"ion-header"),r.TgZ(1,"ion-toolbar"),r.TgZ(2,"ion-title"),r._uU(3,"sc-commande"),r.qZA(),r.TgZ(4,"ion-buttons",0),r._UZ(5,"ion-back-button",1),r.qZA(),r.qZA(),r.qZA(),r.TgZ(6,"ion-content"),r.YNc(7,A,29,1,"ion-grid",2),r.qZA()),2&e&&(r.xp6(7),r.Q6J("ngIf",i.AgenceCommande.length))},directives:[s.Gu,s.sr,s.wd,s.Sm,s.oU,s.cs,s.W2,t.O5,s.jY,s.Nd,s.wI,t.sg,t.PC,s.pK,s.as],pipes:[t.H9],styles:[""]}),e})()}];let C=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=r.oAB({type:e}),e.\u0275inj=r.cJS({imports:[[a.Bz.forChild(p),m.aw.forChild()],a.Bz]}),e})(),f=(()=>{class e{}return e.\u0275fac=function(i){return new(i||e)},e.\u0275mod=r.oAB({type:e}),e.\u0275inj=r.cJS({imports:[[t.ez,o.u5,s.Pc,C,m.aw.forChild()]]}),e})()}}]);