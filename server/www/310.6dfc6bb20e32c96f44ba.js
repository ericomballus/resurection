(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[310],{310:(e,t,i)=>{"use strict";i.r(t),i.d(t,{AdminProductsCategoriePageModule:()=>Z});var o=i(1511),n=i(6073),s=i(8777),r=i(8158),c=i(4762),a=i(1572),l=i(5897);function g(e,t){if(1&e){const e=a.EpF();a.TgZ(0,"ion-item"),a.TgZ(1,"ion-label"),a.TgZ(2,"p",12),a._uU(3),a.qZA(),a.TgZ(4,"p"),a._uU(5),a.ALo(6,"date"),a.qZA(),a.qZA(),a.TgZ(7,"ion-button",13),a.NdJ("click",function(){a.CHM(e);const i=t.$implicit;return a.oxw(2).deleteCategories(i)}),a._UZ(8,"ion-icon",14),a.qZA(),a.qZA()}if(2&e){const e=t.$implicit,i=a.oxw(2);a.xp6(3),a.Oqu(e.name),a.xp6(2),a.Oqu(a.lcZ(6,3,e.created)),a.xp6(2),a.Q6J("disabled",i.del)}}function d(e,t){if(1&e&&(a.TgZ(0,"ion-list"),a.TgZ(1,"ion-list-header"),a._uU(2," ALL PRODUCTS "),a.qZA(),a.YNc(3,g,9,5,"ion-item",11),a.qZA()),2&e){const e=a.oxw();a.xp6(3),a.Q6J("ngForOf",e.categories)}}const u=[{path:"",component:(()=>{class e{constructor(e,t,i){this.catService=e,this.modalController=t,this.alertController=i,this.tabRoles=[],this.del=!0}ngOnInit(){this.getCategories()}register(e){console.log(e.value),this.catService.addMaeriCategories(e.value).subscribe(t=>{e.reset(),this.getCategories()})}presentAlert(){return(0,c.mG)(this,void 0,void 0,function*(){const e=yield this.alertController.create({header:"MAERI",message:"success!!!!",buttons:["OK"]});yield e.present()})}getCategories(){this.catService.getMarieCategories().subscribe(e=>{console.log(e),this.categories=e.category})}deleteCategories(e){let t=e._id;this.catService.deleteMaeriCategories(e._id).subscribe(e=>{console.log(e),this.categories=this.categories.filter(e=>e._id!==t)})}createCategory(){return(0,c.mG)(this,void 0,void 0,function*(){const e=yield this.alertController.create({header:"MAERI",message:"success!!!!",buttons:["OK"]});yield e.present()})}}return e.\u0275fac=function(t){return new(t||e)(a.Y36(l.q),a.Y36(r.IN),a.Y36(r.Br))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-admin-products-categorie"]],decls:22,vars:2,consts:[["slot","start"],[3,"ngSubmit"],["form","ngForm"],["color","primary","justify-content-center",""],["align-self-center","","size-md","6","size-lg","5","size-xs","12"],["padding",""],["position","floating"],["name","name","type","text","ngModel","","required",""],["color","danger","size","large","type","submit","expand","block",3,"disabled"],[1,"container"],[4,"ngIf"],[4,"ngFor","ngForOf"],[1,"p1"],["color","danger","slot","end","small","",3,"disabled","click"],["slot","icon-only","name","trash"]],template:function(e,t){if(1&e){const e=a.EpF();a.TgZ(0,"ion-header"),a.TgZ(1,"ion-toolbar"),a.TgZ(2,"ion-title"),a._uU(3,"admin-products-categorie"),a.qZA(),a.TgZ(4,"ion-buttons",0),a._UZ(5,"ion-back-button"),a.qZA(),a.qZA(),a.qZA(),a.TgZ(6,"ion-content"),a.TgZ(7,"form",1,2),a.NdJ("ngSubmit",function(){a.CHM(e);const i=a.MAs(8);return t.register(i)}),a.TgZ(9,"ion-grid"),a.TgZ(10,"ion-row",3),a.TgZ(11,"ion-col",4),a.TgZ(12,"div",5),a.TgZ(13,"ion-item"),a.TgZ(14,"ion-label",6),a._uU(15,"name"),a.qZA(),a._UZ(16,"ion-input",7),a.qZA(),a.qZA(),a.TgZ(17,"div",5),a.TgZ(18,"ion-button",8),a._uU(19,"Register"),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(20,"div",9),a.YNc(21,d,4,1,"ion-list",10),a.qZA(),a.qZA()}if(2&e){const e=a.MAs(8);a.xp6(18),a.Q6J("disabled",e.invalid),a.xp6(3),a.Q6J("ngIf",t.categories)}},directives:[r.Gu,r.sr,r.wd,r.Sm,r.oU,r.cs,r.W2,n.Y7,n.JL,n.F,r.jY,r.Nd,r.wI,r.Ie,r.Q$,r.pK,r.j9,n.JJ,n.On,n.Q7,r.YG,o.O5,r.q_,r.yh,o.sg,r.gu],pipes:[o.uU],styles:[""]}),e})()}];let Z=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[o.ez,n.u5,r.Pc,s.Bz.forChild(u)]]}),e})()}}]);