(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[5857],{5857:(t,e,n)=>{"use strict";n.r(e),n.d(e,{ProductManufacturedManagePageModule:()=>m});var i=n(1511),o=n(6073),a=n(8777),s=n(8158),r=n(1572),l=n(731),c=n(4144),u=n(1064);function g(t,e){if(1&t){const t=r.EpF();r.TgZ(0,"ion-item",10),r.NdJ("click",function(){r.CHM(t);const n=e.$implicit;return r.oxw(2).displayDetails(n)}),r.TgZ(1,"ion-avatar",5),r._UZ(2,"img",11),r.qZA(),r.TgZ(3,"ion-label",12),r.TgZ(4,"p",13),r._uU(5),r.qZA(),r.TgZ(6,"p"),r._uU(7),r.qZA(),r.TgZ(8,"p"),r._uU(9),r.ALo(10,"translate"),r.ALo(11,"translate"),r.qZA(),r.qZA(),r.qZA()}if(2&t){const t=e.$implicit;r.xp6(2),r.s9C("src",t.url,r.LSH),r.xp6(3),r.Oqu(t.name),r.xp6(2),r.AsE("",t.purchasingPrice," -- ",t.sellingPrice,""),r.xp6(2),r.HOy(" ",r.lcZ(10,8,"MENU.in_stock"),": ",t.quantityItems," ",r.lcZ(11,10,"MENU.in_store"),": ",t.quantityStore," ")}}function p(t,e){if(1&t&&(r.TgZ(0,"ion-list",8),r.YNc(1,g,12,12,"ion-item",9),r.qZA()),2&t){const t=r.oxw();r.xp6(1),r.Q6J("ngForOf",t.manufacturedItem)}}const f=function(){return["/product-manufactured-buy"]},d=[{path:"",component:(()=>{class t{constructor(t,e,n,i,o,a,s){this.translateConfigService=t,this.restApiService=e,this.modalController=n,this.alertController=i,this.actionSheetController=o,this.toastController=a,this.translate=s,this.manufacturedItem=[],this.takeManufacturedItems(),this.languageChanged()}ngOnInit(){}languageChanged(){console.log("lang shop page");let t=localStorage.getItem("language");t&&this.translateConfigService.setLanguage(t)}takeManufacturedItems(){this.restApiService.getManufacturedProductItemResto2().subscribe(t=>{console.log(t),this.manufacturedItem=t})}displayDetails(t){}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(l.w),r.Y36(c.e),r.Y36(s.IN),r.Y36(s.Br),r.Y36(s.BX),r.Y36(s.yF),r.Y36(u.sK))},t.\u0275cmp=r.Xpm({type:t,selectors:[["app-product-manufactured-manage"]],decls:12,vars:6,consts:[["color","primary"],[1,"titre"],["slot","end"],[3,"routerLink"],["name","add-circle-outline"],["slot","start"],["autoHide","false"],["lines","full",4,"ngIf"],["lines","full"],["lines","full",3,"click",4,"ngFor","ngForOf"],["lines","full",3,"click"],[3,"src"],[1,"ion-text-wrap"],[1,"name"]],template:function(t,e){1&t&&(r.TgZ(0,"ion-header"),r.TgZ(1,"ion-toolbar",0),r.TgZ(2,"ion-title",1),r._uU(3),r.ALo(4,"translate"),r.qZA(),r.TgZ(5,"ion-buttons",2),r.TgZ(6,"ion-button",3),r._UZ(7,"ion-icon",4),r.qZA(),r.qZA(),r.TgZ(8,"ion-buttons",5),r._UZ(9,"ion-menu-button",6),r.qZA(),r.qZA(),r.qZA(),r.TgZ(10,"ion-content"),r.YNc(11,p,2,1,"ion-list",7),r.qZA()),2&t&&(r.xp6(3),r.Oqu(r.lcZ(4,3,"MENU.dishes")),r.xp6(3),r.Q6J("routerLink",r.DdM(5,f)),r.xp6(5),r.Q6J("ngIf",e.manufacturedItem))},directives:[s.Gu,s.sr,s.wd,s.Sm,s.YG,s.YI,a.rH,s.gu,s.fG,s.W2,i.O5,s.q_,i.sg,s.Ie,s.BJ,s.Q$],pipes:[u.X$],styles:[""]}),t})()}];let m=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[i.ez,o.u5,s.Pc,a.Bz.forChild(d),u.aw.forChild()]]}),t})()}}]);