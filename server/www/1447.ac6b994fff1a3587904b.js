(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[1447],{1447:(e,t,n)=>{"use strict";n.r(t),n.d(t,{HomeExpensePageModule:()=>U});var o=n(1511),i=n(6073),s=n(8158),r=n(8777),a=n(4762),l=n(5959),c=n(5416),d=n(1572),g=n(1592),p=n(4375),h=n(5511),u=n(2874),m=n(5946),Z=n(6351);function f(e,t){if(1&e&&(d.TgZ(0,"ion-col",19),d.TgZ(1,"pre"),d._uU(2),d.qZA(),d.qZA()),2&e){const e=d.oxw();d.xp6(2),d.lnq("",e.model.day,"/",e.model.month,"/",e.model.year,"")}}function x(e,t){if(1&e&&(d.TgZ(0,"ion-col",19),d.TgZ(1,"pre"),d._uU(2),d.qZA(),d.qZA()),2&e){const e=d.oxw();d.xp6(2),d.lnq("",e.model2.day,"/",e.model2.month,"/",e.model2.year,"")}}function A(e,t){if(1&e){const e=d.EpF();d.TgZ(0,"ion-col",20),d.TgZ(1,"div",21),d.TgZ(2,"ion-button",22),d.NdJ("click",function(){return d.CHM(e),d.oxw().takeInventory()}),d._uU(3," submit"),d.qZA(),d.qZA(),d.qZA()}}function q(e,t){if(1&e&&(d.TgZ(0,"p"),d._uU(1),d.qZA()),2&e){const e=d.oxw(2).$implicit;d.xp6(1),d.Oqu(e.description)}}function T(e,t){if(1&e&&(d.TgZ(0,"ion-col",29),d.TgZ(1,"div",30),d.YNc(2,q,2,1,"p",18),d.qZA(),d.qZA()),2&e){const e=d.oxw().$implicit;d.xp6(2),d.Q6J("ngIf",e&&e.description)}}const y=function(e){return{"background-color":e}},v=function(e){return[e,"FCFA","symbol","3.0-0","fr"]};function S(e,t){if(1&e){const e=d.EpF();d.TgZ(0,"ion-row",26),d.NdJ("click",function(){d.CHM(e);const n=t.$implicit,o=t.index;return d.oxw(2).presentActionSheet(n,o)}),d.TgZ(1,"ion-col",24),d.TgZ(2,"div",27),d._uU(3),d.ALo(4,"date"),d.qZA(),d.qZA(),d.TgZ(5,"ion-col",24),d.TgZ(6,"div",27),d._uU(7),d.ALo(8,"currency"),d.qZA(),d.qZA(),d.TgZ(9,"ion-col",24),d.TgZ(10,"div",27),d._uU(11),d.qZA(),d.qZA(),d.TgZ(12,"ion-col",24),d.TgZ(13,"div",27),d._uU(14),d.qZA(),d.qZA(),d.YNc(15,T,3,1,"ion-col",28),d.qZA()}if(2&e){const e=t.$implicit;d.Q6J("ngStyle",d.VKq(15,y,t.index%2==0?"#f1f1f1":"white")),d.xp6(3),d.hij(" ",d.xi3(4,6,e.created,"short")," "),d.xp6(4),d.hij(" ",d.G7q(8,9,d.VKq(17,v,e.amount?e.amount:0))," "),d.xp6(4),d.hij(" ",e.reason," "),d.xp6(3),d.hij(" ",e.storeName?e.storeName:"no name"," "),d.xp6(1),d.Q6J("ngIf",e&&e.open)}}function b(e,t){if(1&e&&(d.TgZ(0,"ion-grid"),d.TgZ(1,"ion-row",23),d.TgZ(2,"ion-col",24),d.TgZ(3,"div",21),d._uU(4,"Date"),d.qZA(),d.qZA(),d.TgZ(5,"ion-col",24),d.TgZ(6,"div",21),d._uU(7,"Montant"),d.qZA(),d.qZA(),d.TgZ(8,"ion-col",24),d.TgZ(9,"div",21),d._uU(10,"motif"),d.qZA(),d.qZA(),d.TgZ(11,"ion-col",24),d._UZ(12,"div",21),d.qZA(),d.qZA(),d.YNc(13,S,16,19,"ion-row",25),d.qZA()),2&e){const e=d.oxw();d.xp6(13),d.Q6J("ngForOf",e.expensesList)}}function C(e,t){1&e&&(d.TgZ(0,"div"),d._UZ(1,"app-fakedata"),d.qZA())}const w=function(){return{padding:"15px"}},J=[{path:"",component:(()=>{class e{constructor(e,t,n,o,i,s,r,a){this.router=e,this.expenseService=t,this.saveRandom=n,this.calendar=o,this.notifi=i,this.actionSheet=s,this.alertController=r,this.adminService=a,this.categories=[],this.expensesList=[],this.response=!1,this.destroy$=new l.xQ,this.model=this.calendar.getToday(),this.model2=this.calendar.getToday()}ngOnInit(){}ionViewWillEnter(){this.getCategorie(),this.getExpense(),this.takeCashOpen()}addExpenses(){this.router.navigateByUrl("/add-expense?page=expense.page")}addCategorie(){this.router.navigateByUrl("/categorie-expense?page=expense.page")}getCategorie(){this.expenseService.getExpenseCategories().subscribe(e=>{console.log(e),this.categories=e,this.expenseService.setCategorie(e)})}getExpense(){this.saveRandom.getStoreList(),this.expenseService.getExpense().subscribe(e=>{console.log(e),this.response=!0,this.assignStore(e)})}takeInventory(){let e,t,n;if(n=`${this.model.year.toString()}`,this.model.day.toString(),e=`${this.model.day+1}`,this.model.month.toString(),t=`${this.model.month}`,new Date(this.model.year,this.model.month,this.model.day).getTime()>new Date(this.model2.year,this.model2.month,this.model2.day).getTime())console.log("impossible"),this.notifi.presentError("Sorry, the start date must be less than the end date","danger");else{let e={};e.start=new Date(this.model.year,this.model.month-1,this.model.day+1).toISOString(),e.end=new Date(this.model2.year,this.model2.month-1,this.model2.day+1).toISOString(),e.start==e.end&&(e.start=new Date(this.model.year,this.model.month-1,this.model.day).toISOString()),console.log(e),this.expenseService.getExpenseByDate(e).subscribe(e=>{e.length?this.assignStore(e):this.notifi.presentToast("aucun resultat disponible pour votre recherche","primary")},e=>{this.notifi.presentToast("une erreur est survenue !","danger")})}}assignStore(e){let t=this.saveRandom.getStoreList();for(const n of e)for(const e of t)e.id==n.storeId&&(n.storeName=e.name);this.expensesList=e}displayDescription(e){e.open=!e.open}presentActionSheet(e,t){return(0,a.mG)(this,void 0,void 0,function*(){if(e.open)return void(e.open=!e.open);const n=yield this.actionSheet.create({header:"",buttons:[{text:"Description",icon:"share",handler:()=>{this.displayDescription(e)}},{text:"Supprimer",role:"destructive",icon:"trash",handler:()=>{this.presentAlertConfirm(e,t)}},{text:"Cancel",icon:"close",role:"cancel",handler:()=>{console.log("Cancel clicked")}}]});yield n.present();const{role:o,data:i}=yield n.onDidDismiss();console.log("onDidDismiss resolved with role and data",o,i)})}presentAlertConfirm(e,t){return(0,a.mG)(this,void 0,void 0,function*(){const n=yield this.alertController.create({cssClass:"my-custom-class",header:"Confirm!",message:"Voulez vous supprimer ?",buttons:[{text:"NON",role:"cancel",cssClass:"secondary",handler:e=>{console.log("Confirm Cancel: blah")}},{text:"OUI",handler:()=>{this.removePurchase(e,t)}}]});yield n.present()})}removePurchase(e,t){this.notifi.presentLoading(),this.expenseService.deleteExpense(e).subscribe(e=>{this.notifi.dismissLoading(),this.expensesList.splice(t,1)})}takeCashOpen(){this.saveRandom.getStoreId(),this.adminService.getOpenCash().pipe((0,c.R)(this.destroy$)).subscribe(e=>{console.log("cash id here ===>",e),e.docs.length>0&&(localStorage.setItem("openCashDateObj",JSON.stringify(e.docs[0])),localStorage.setItem("openCashDateId",e.docs[0]._id),JSON.parse(localStorage.getItem("openCashDateObj")))})}}return e.\u0275fac=function(t){return new(t||e)(d.Y36(r.F0),d.Y36(g.$),d.Y36(p.i),d.Y36(h.vL),d.Y36(u.g),d.Y36(s.BX),d.Y36(s.Br),d.Y36(m.l))},e.\u0275cmp=d.Xpm({type:e,selectors:[["app-home-expense"]],decls:39,vars:9,consts:[["slot","end"],[3,"click"],["slot","start"],["autoHide","false"],[3,"ngStyle"],["size","3"],[1,"form-inline"],[1,"form-group"],[1,"input-group"],["placeholder","yyyy-mm-dd","name","dp","ngbDatepicker","",1,"form-control",2,"display","none",3,"ngModel","ngModelChange"],["d","ngbDatepicker"],[1,"input-group-append"],["fill","clear","size","small","type","button",1,"btn","btn-outline-secondary","calendar",3,"click"],["name","calendar"],["size","3","class","ion-padding ion-align-self-center",4,"ngIf"],["d2","ngbDatepicker"],[1,"ion-align-items-center"],["class","ion-align-self-center",4,"ngIf"],[4,"ngIf"],["size","3",1,"ion-padding","ion-align-self-center"],[1,"ion-align-self-center"],[1,"ion-text-center"],["size","small",3,"click"],[1,"header-component"],["size-sm","3","size-md","3","size-lg","3"],["class","data-row data-update","style","font-size: 12px",3,"ngStyle","click",4,"ngFor","ngForOf"],[1,"data-row","data-update",2,"font-size","12px",3,"ngStyle","click"],[1,"ion-text-center","ion-text-uppercase","smallSize"],["size","12",4,"ngIf"],["size","12"],[2,"font-size","13px"]],template:function(e,t){if(1&e){const e=d.EpF();d.TgZ(0,"ion-header"),d.TgZ(1,"ion-toolbar"),d._UZ(2,"ion-title"),d.TgZ(3,"ion-buttons",0),d.TgZ(4,"ion-button",1),d.NdJ("click",function(){return t.addCategorie()}),d._uU(5," categorie "),d.qZA(),d.TgZ(6,"ion-button",1),d.NdJ("click",function(){return t.addExpenses()}),d._uU(7," ajouter "),d.qZA(),d.qZA(),d.TgZ(8,"ion-buttons",2),d._UZ(9,"ion-menu-button",3),d.qZA(),d.qZA(),d.qZA(),d.TgZ(10,"ion-content"),d.TgZ(11,"div",4),d.TgZ(12,"ion-row"),d.TgZ(13,"ion-col",5),d.TgZ(14,"form",6),d.TgZ(15,"div",7),d.TgZ(16,"div",8),d.TgZ(17,"input",9,10),d.NdJ("ngModelChange",function(e){return t.model=e}),d.qZA(),d.TgZ(19,"div",11),d.TgZ(20,"ion-button",12),d.NdJ("click",function(){return d.CHM(e),d.MAs(18).toggle()}),d._uU(21,"start "),d._UZ(22,"ion-icon",13),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.YNc(23,f,3,3,"ion-col",14),d.YNc(24,x,3,3,"ion-col",14),d.TgZ(25,"ion-col",5),d.TgZ(26,"form",6),d.TgZ(27,"div",7),d.TgZ(28,"div",8),d.TgZ(29,"input",9,15),d.NdJ("ngModelChange",function(e){return t.model2=e}),d.qZA(),d.TgZ(31,"div",11),d.TgZ(32,"ion-button",12),d.NdJ("click",function(){return d.CHM(e),d.MAs(30).toggle()}),d._uU(33,"End "),d._UZ(34,"ion-icon",13),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.qZA(),d.TgZ(35,"ion-row",16),d.YNc(36,A,4,0,"ion-col",17),d.qZA(),d.qZA(),d.YNc(37,b,14,1,"ion-grid",18),d.YNc(38,C,2,0,"div",18),d.qZA()}2&e&&(d.xp6(11),d.Q6J("ngStyle",d.DdM(8,w)),d.xp6(6),d.Q6J("ngModel",t.model),d.xp6(6),d.Q6J("ngIf",t.model),d.xp6(1),d.Q6J("ngIf",t.model2),d.xp6(5),d.Q6J("ngModel",t.model2),d.xp6(7),d.Q6J("ngIf",t.model&&t.model2),d.xp6(1),d.Q6J("ngIf",t.expensesList.length),d.xp6(1),d.Q6J("ngIf",!t.response))},directives:[s.Gu,s.sr,s.wd,s.Sm,s.YG,s.fG,s.W2,o.PC,s.Nd,s.wI,i.Y7,i.JL,i.F,h.J4,i.Fj,i.JJ,i.On,s.gu,o.O5,s.jY,o.sg,Z.Q],pipes:[o.uU,o.H9],styles:[""]}),e})()}];let I=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=d.oAB({type:e}),e.\u0275inj=d.cJS({imports:[[r.Bz.forChild(J)],r.Bz]}),e})();var k=n(9547);let U=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=d.oAB({type:e}),e.\u0275inj=d.cJS({imports:[[o.ez,i.u5,s.Pc,I,k.G,h.IJ]]}),e})()}}]);