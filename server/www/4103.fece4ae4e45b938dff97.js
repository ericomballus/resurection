(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[4103],{5741:(i,e,o)=>{"use strict";o.r(e),o.d(e,{FicheDetailsPageModule:()=>A});var t=o(1511),n=o(6073),c=o(8158),s=o(8777),Z=o(1572),l=o(754);const r=function(i){return{"background-color":i}};function g(i,e){if(1&i&&(Z.TgZ(0,"ion-row",9),Z.TgZ(1,"ion-col",8),Z.TgZ(2,"div",10),Z._uU(3),Z.qZA(),Z.qZA(),Z.TgZ(4,"ion-col",11),Z.TgZ(5,"div",4),Z._uU(6),Z.qZA(),Z.qZA(),Z.TgZ(7,"ion-col",11),Z.TgZ(8,"div",4),Z._uU(9),Z.qZA(),Z.qZA(),Z.TgZ(10,"ion-col",8),Z.TgZ(11,"div",4),Z._uU(12),Z.qZA(),Z.qZA(),Z.TgZ(13,"ion-col",8),Z.TgZ(14,"div",4),Z._uU(15),Z.qZA(),Z.qZA(),Z.TgZ(16,"ion-col",8),Z.TgZ(17,"div",4),Z._uU(18),Z.ALo(19,"currency"),Z.qZA(),Z.qZA(),Z.TgZ(20,"ion-col",8),Z.TgZ(21,"div",4),Z._uU(22),Z.ALo(23,"currency"),Z.qZA(),Z.qZA(),Z.qZA()),2&i){const i=e.$implicit;Z.Q6J("ngStyle",Z.VKq(18,r,e.index%2==0?"#f1f1f1":"white")),Z.xp6(3),Z.hij(" ",i.name," "),Z.xp6(3),Z.hij(" ",i.quantityStore?i.quantityStore:0," "),Z.xp6(3),Z.hij(" ",i.pointage?i.pointage:0," "),Z.xp6(3),Z.hij(" ",i.stockFinale?i.stockFinale:0," "),Z.xp6(3),Z.hij(" ",i.ventes?i.ventes:0," "),Z.xp6(3),Z.hij(" ",Z.gM2(19,8,i.sellingPrice,"FCFA","symbol","3.0-0")," "),Z.xp6(4),Z.hij(" ",Z.gM2(23,13,i.ventes*i.sellingPrice,"FCFA","symbol","3.0-0")," ")}}const u=[{path:"",component:(()=>{class i{constructor(i,e){this.ficheService=i,this.location=e,this.totalPrice=0,this.totalQuantity=0}ngOnInit(){this.fiche=this.ficheService.getLocalFichePointage(),console.log(this.fiche),this.fiche.list.forEach(i=>{i.ventes||(i.ventes=0),this.totalPrice=this.totalPrice+i.ventes*i.sellingPrice})}}return i.\u0275fac=function(e){return new(e||i)(Z.Y36(l.i),Z.Y36(t.Ye))},i.\u0275cmp=Z.Xpm({type:i,selectors:[["app-fiche-details"]],decls:37,vars:7,consts:[["slot","start"],["defaultHref","/fiche-list"],["color","primary",1,"header-component"],["size-sm","2","size-md","2","size-lg","2"],[1,"ion-text-center","ion-text-uppercase"],["size-sm","1","size-md","1","size-lg","1"],["class","row-component",3,"ngStyle",4,"ngFor","ngForOf"],["offset","8","size-sm","2","size-md","2","size-lg","2",1,"ion-align-self-center"],["size-sm","2","size-md","2","size-lg","2",1,"ion-align-self-center"],[1,"row-component",3,"ngStyle"],[1,"ion-text-start","ion-text-uppercase",2,"font-weight","bold"],["size-sm","1","size-md","1","size-lg","1",1,"ion-align-self-center"]],template:function(i,e){1&i&&(Z.TgZ(0,"ion-header"),Z.TgZ(1,"ion-toolbar"),Z._UZ(2,"ion-title"),Z.TgZ(3,"ion-buttons",0),Z._UZ(4,"ion-back-button",1),Z.qZA(),Z.qZA(),Z.qZA(),Z.TgZ(5,"ion-content"),Z.TgZ(6,"ion-row",2),Z.TgZ(7,"ion-col",3),Z.TgZ(8,"div",4),Z._uU(9,"name"),Z.qZA(),Z.qZA(),Z.TgZ(10,"ion-col",5),Z.TgZ(11,"div",4),Z._uU(12,"S.I"),Z.qZA(),Z.qZA(),Z.TgZ(13,"ion-col",5),Z.TgZ(14,"div",4),Z._uU(15,"Qt\xe9"),Z.qZA(),Z.qZA(),Z.TgZ(16,"ion-col",3),Z.TgZ(17,"div",4),Z._uU(18,"S.F"),Z.qZA(),Z.qZA(),Z.TgZ(19,"ion-col",3),Z.TgZ(20,"div",4),Z._uU(21,"Qt\xe9.Vendu"),Z.qZA(),Z.qZA(),Z.TgZ(22,"ion-col",3),Z.TgZ(23,"div",4),Z._uU(24,"P.U"),Z.qZA(),Z.qZA(),Z.TgZ(25,"ion-col",3),Z.TgZ(26,"div",4),Z._uU(27,"Prix"),Z.qZA(),Z.qZA(),Z.qZA(),Z.YNc(28,g,24,20,"ion-row",6),Z.TgZ(29,"ion-row"),Z.TgZ(30,"ion-col",7),Z.TgZ(31,"div",4),Z._uU(32,"TOTAL"),Z.qZA(),Z.qZA(),Z.TgZ(33,"ion-col",8),Z.TgZ(34,"div",4),Z._uU(35),Z.ALo(36,"currency"),Z.qZA(),Z.qZA(),Z.qZA(),Z.qZA()),2&i&&(Z.xp6(28),Z.Q6J("ngForOf",e.fiche.list),Z.xp6(7),Z.hij(" ",Z.gM2(36,2,e.totalPrice,"FCFA","symbol","3.0-0")," "))},directives:[c.Gu,c.sr,c.wd,c.Sm,c.oU,c.cs,c.W2,c.Nd,c.wI,t.sg,t.PC],pipes:[t.H9],styles:[""]}),i})()}];let a=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=Z.oAB({type:i}),i.\u0275inj=Z.cJS({imports:[[s.Bz.forChild(u)],s.Bz]}),i})(),A=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=Z.oAB({type:i}),i.\u0275inj=Z.cJS({imports:[[t.ez,n.u5,c.Pc,a]]}),i})()}}]);