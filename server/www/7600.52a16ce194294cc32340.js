(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[7600],{7600:(i,t,e)=>{"use strict";e.r(t),e.d(t,{FicheListPageModule:()=>w});var o=e(1511),n=e(6073),r=e(8158),s=e(8777),c=e(4762),l=e(1572),a=e(4144),g=e(731),u=e(1064),d=e(2874),h=e(4375),f=e(754),Z=e(2968),p=e(1044);const m=function(i){return{"background-color":i}};function v(i,t){if(1&i){const i=l.EpF();l.TgZ(0,"ion-row",9),l.TgZ(1,"ion-col",5),l.TgZ(2,"div",6),l._uU(3),l.ALo(4,"date"),l.qZA(),l.qZA(),l.TgZ(5,"ion-col",5),l.TgZ(6,"div",6),l._uU(7),l.qZA(),l.qZA(),l.TgZ(8,"ion-col",7),l.TgZ(9,"div",6),l.TgZ(10,"ion-button",10),l.NdJ("click",function(){l.CHM(i);const e=t.$implicit;return l.oxw(3).voir(e)}),l._uU(11,"voir"),l.qZA(),l.qZA(),l.qZA(),l.qZA()}if(2&i){const i=t.$implicit;l.Q6J("ngStyle",l.VKq(6,m,t.index%2==0?"#f1f1f1":"white")),l.xp6(3),l.hij(" ",l.xi3(4,3,i.created,"short")," "),l.xp6(4),l.hij(" ",i.open?"ouvert":"ferm\xe9"," ")}}function A(i,t){if(1&i&&(l.TgZ(0,"ion-slide"),l.TgZ(1,"ion-grid"),l.TgZ(2,"ion-row"),l.TgZ(3,"ion-col"),l.TgZ(4,"div",3),l.TgZ(5,"h4"),l._uU(6),l.qZA(),l.qZA(),l.qZA(),l.qZA(),l.TgZ(7,"ion-row",4),l.TgZ(8,"ion-col",5),l.TgZ(9,"div",6),l._uU(10,"Date"),l.qZA(),l.qZA(),l.TgZ(11,"ion-col",5),l.TgZ(12,"div",6),l._uU(13,"Status"),l.qZA(),l.qZA(),l.TgZ(14,"ion-col",7),l._UZ(15,"div",6),l.qZA(),l.qZA(),l.YNc(16,v,12,8,"ion-row",8),l.qZA(),l.qZA()),2&i){const i=t.$implicit;l.xp6(6),l.Oqu(i.storeName),l.xp6(10),l.Q6J("ngForOf",i)}}function S(i,t){if(1&i&&(l.TgZ(0,"ion-slides",1),l.YNc(1,A,17,2,"ion-slide",2),l.qZA()),2&i){const i=l.oxw();l.xp6(1),l.Q6J("ngForOf",i.multiStoreList)}}const q=[{path:"",component:(()=>{class i{constructor(i,t,e,o,n,r,s,c,l,a){this.restApiService=i,this.translateConfigService=t,this.translate=e,this.notification=o,this.randomStorage=n,this.ficheService=r,this.urlService=s,this.location=c,this.rangeByStoreService=l,this.router=a,this.productsServices=[],this.storeTypes=[],this.randomObj={},this.firstTime=!1,this.isOpen=!0,this.confirm=!1,this.multiStoreList=[]}ngOnInit(){this.takeFichePointage()}takeUrl(){this.urlService.getUrl().subscribe(i=>{this.url=i,this.adminId=localStorage.getItem("adminId")})}takeFichePointage(){return(0,c.mG)(this,void 0,void 0,function*(){this.notification.presentLoading(),this.ficheService.getAllPointageList().subscribe(i=>(0,c.mG)(this,void 0,void 0,function*(){this.notification.dismissLoading(),console.log("fiche pointage",i);let t=i.docs,e=yield this.rangeByStoreService.rangeProductByStore(t);console.log("group",e),this.multiStoreList=e}),i=>{this.notification.dismissLoading(),console.log(i)})})}voir(i){console.log(i),this.ficheService.setFichePointage(i),this.router.navigateByUrl("fiche-details")}}return i.\u0275fac=function(t){return new(t||i)(l.Y36(a.e),l.Y36(g.w),l.Y36(u.sK),l.Y36(d.g),l.Y36(h.i),l.Y36(f.i),l.Y36(Z.i),l.Y36(o.Ye),l.Y36(p.n),l.Y36(s.F0))},i.\u0275cmp=l.Xpm({type:i,selectors:[["app-fiche-list"]],decls:5,vars:1,consts:[["pager","true",4,"ngIf"],["pager","true"],[4,"ngFor","ngForOf"],[1,"ion-text-center","ion-text-uppercase"],[1,"header-component"],["size-sm","5","size-md","5","size-lg","5"],[1,"ion-text-center"],["size-sm","2","size-md","2","size-lg","2"],["class","row-componentt",3,"ngStyle",4,"ngFor","ngForOf"],[1,"row-componentt",3,"ngStyle"],["size","small",3,"click"]],template:function(i,t){1&i&&(l.TgZ(0,"ion-header"),l.TgZ(1,"ion-toolbar"),l._UZ(2,"ion-title"),l.qZA(),l.qZA(),l.TgZ(3,"ion-content"),l.YNc(4,S,2,1,"ion-slides",0),l.qZA()),2&i&&(l.xp6(4),l.Q6J("ngIf",t.multiStoreList.length))},directives:[r.Gu,r.sr,r.wd,r.W2,o.O5,r.Hr,o.sg,r.A$,r.jY,r.Nd,r.wI,o.PC,r.YG],pipes:[o.uU],styles:[""]}),i})()}];let T=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=l.oAB({type:i}),i.\u0275inj=l.cJS({imports:[[s.Bz.forChild(q)],s.Bz]}),i})(),w=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=l.oAB({type:i}),i.\u0275inj=l.cJS({imports:[[o.ez,n.u5,r.Pc,T,u.aw.forChild()]]}),i})()},1044:(i,t,e)=>{"use strict";e.d(t,{n:()=>s});var o=e(4762),n=e(1572),r=e(9719);let s=(()=>{class i{constructor(i){this.getStoreName=i}rangeProductByStore(i){return new Promise((t,e)=>{let n=i.reduce((i,t)=>(i[t.storeId]=[...i[t.storeId]||[],t],i),{}),r=[];for(const i in n)r.push(n[i]);r.forEach(i=>(0,o.mG)(this,void 0,void 0,function*(){let t=yield this.getStoreName.takeName(i);i.storeName=t})),t(r)})}}return i.\u0275fac=function(t){return new(t||i)(n.LFG(r.$))},i.\u0275prov=n.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()}}]);