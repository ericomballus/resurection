(self.webpackChunkWebsite=self.webpackChunkWebsite||[]).push([[5758],{5758:(e,o,t)=>{"use strict";t.r(o),t.d(o,{EmployeesListPageModule:()=>q});var i=t(1511),n=t(6073),s=t(8777),l=t(8158),c=t(4762),r=t(3511),m=t(97),a=t(1572),p=t(4144),d=t(5946),h=t(2181),u=t(4892),g=t(9719),y=t(4375),Z=t(1064);function f(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"ion-button",7),a.NdJ("click",function(){return a.CHM(e),a.oxw().employeeAdd()}),a._UZ(1,"ion-icon",8),a.qZA()}}function E(e,o){1&e&&a._UZ(0,"ion-list-header")}function A(e,o){if(1&e&&(a.TgZ(0,"h6",19),a._uU(1),a.qZA()),2&e){const e=o.$implicit,t=o.index;a.xp6(1),a.AsE(" Role ",t+1,"-: ",e.name," ")}}function v(e,o){if(1&e){const e=a.EpF();a.TgZ(0,"ion-item"),a.TgZ(1,"ion-avatar",3),a._UZ(2,"img",11),a.qZA(),a.TgZ(3,"ion-label"),a.TgZ(4,"h3"),a._uU(5),a.qZA(),a.TgZ(6,"h3"),a._uU(7),a.ALo(8,"translate"),a.qZA(),a.YNc(9,A,2,2,"h6",12),a.TgZ(10,"h3"),a._uU(11),a.ALo(12,"translate"),a.qZA(),a.TgZ(13,"div"),a.TgZ(14,"ion-button",13),a.NdJ("click",function(){a.CHM(e);const t=o.$implicit;return a.oxw(2).updateEmploye(t)}),a._UZ(15,"ion-icon",14),a.qZA(),a.TgZ(16,"ion-button",15),a.NdJ("click",function(){a.CHM(e);const t=o.$implicit;return a.oxw(2).deleteEmploye(t)}),a._UZ(17,"ion-icon",16),a.qZA(),a.TgZ(18,"ion-button",17),a.NdJ("click",function(){a.CHM(e);const t=o.$implicit;return a.oxw(2).viewEmploye(t)}),a._UZ(19,"ion-icon",18),a.qZA(),a.qZA(),a.qZA(),a.qZA()}if(2&e){const e=o.$implicit;a.xp6(5),a.Oqu(e.name),a.xp6(2),a.AsE("",a.lcZ(8,6,"MENU.poste"),": ",e.poste,""),a.xp6(2),a.Q6J("ngForOf",e.role),a.xp6(2),a.AsE("",a.lcZ(12,8,"MENU.phone"),": ",e.telephone,"")}}function b(e,o){if(1&e&&(a.TgZ(0,"ion-slide"),a.TgZ(1,"ion-grid"),a.TgZ(2,"ion-row"),a.TgZ(3,"ion-col"),a.TgZ(4,"div",9),a.TgZ(5,"h4"),a._uU(6),a.qZA(),a.qZA(),a.qZA(),a.qZA(),a.TgZ(7,"ion-list"),a.TgZ(8,"ion-list"),a.YNc(9,E,1,0,"ion-list-header",10),a.YNc(10,v,20,10,"ion-item",6),a.qZA(),a.qZA(),a.qZA(),a.qZA()),2&e){const e=o.$implicit,t=a.oxw();a.xp6(6),a.hij(" ",e.storeName?e.storeName:"no name"," "),a.xp6(3),a.Q6J("ngIf",t.admin),a.xp6(1),a.Q6J("ngForOf",e)}}const k=[{path:"",component:(()=>{class e{constructor(e,o,t,i,n,s,l,c){this.restApiService=e,this.navCtrl=o,this.modalController=t,this.adminService=i,this.authService=n,this.socket=s,this.getStoreName=l,this.saveRandom=c,this.tabRoles=[],this.admin=!1,this.multiStoreEmploye=[],this.tabRoles=JSON.parse(localStorage.getItem("roles")),this.tabRoles.includes(1)||this.tabRoles.includes(2),this.tabRoles.includes(1)&&(this.admin=!0,this.takeEmployees())}ngOnInit(){this.adminId=localStorage.getItem("adminId"),this.webServerSocket(this.adminId)}webServerSocket(e){this.socket.connect(),this.socket.fromEvent(`${e}employeAdd`).subscribe(e=>{this.ListEmploye.unshift(e),this.takeEmployees()}),this.socket.fromEvent(`${e}employeDelete`).subscribe(e=>{console.log("socket io action"),console.log(e),this.ListEmploye=this.ListEmploye.filter(o=>o._id!==e),this.takeEmployees()}),this.socket.fromEvent(`${e}employeRoleAdd`).subscribe(e=>{this.takeEmployees(),(()=>(0,c.mG)(this,void 0,void 0,function*(){return Promise.all(this.ListEmploye.filter(o=>o._id!==e._id))}))().then(o=>{console.log("hello",o),o.unshift(e),this.ListEmploye=o})}),this.socket.fromEvent(`${e}employeRoleDelete`).subscribe(e=>{this.takeEmployees(),(()=>(0,c.mG)(this,void 0,void 0,function*(){return Promise.all(this.ListEmploye.filter(o=>o._id!==e._id))}))().then(o=>{console.log("hello",o),o.unshift(e),this.ListEmploye=o})})}employeeAdd(){return(0,c.mG)(this,void 0,void 0,function*(){const e=yield this.modalController.create({component:r.e,componentProps:{flag:"employeeAddFlag"}});return e.onDidDismiss().then(e=>{console.log(e),"add"==e.data&&this.takeEmployees()}),yield e.present()})}employeeShow(){return(0,c.mG)(this,void 0,void 0,function*(){const e=yield this.modalController.create({component:r.e,componentProps:{product:"employeeShowFlag"}});return e.onDidDismiss().then(e=>{console.log(e)}),yield e.present()})}deleteEmploye(e){console.log(e),this.authService.deleteEmploye(e._id).subscribe(e=>{this.takeEmployees()})}takeEmployees(){this.authService.getEmployees().subscribe(e=>{console.log(e),this.ListEmploye=e.employes;let o=this.ListEmploye.reduce((e,o)=>(e[o.storeId]=[...e[o.storeId]||[],o],e),{});this.multiStoreEmploye=[],console.log(o);for(const t in o)this.multiStoreEmploye.push(o[t]);console.log("group here",this.multiStoreEmploye),this.multiStoreEmploye.forEach(e=>(0,c.mG)(this,void 0,void 0,function*(){let o=yield this.getStoreName.takeName(e);e.storeName=o}))})}updateEmploye(e){return(0,c.mG)(this,void 0,void 0,function*(){console.log(e),this.saveRandom.setRetailer(e);const o=yield this.modalController.create({component:m.Y,componentProps:{employe:{flag:"update",data:e}}});return o.onDidDismiss().then(e=>{this.takeEmployees()}),yield o.present()})}viewEmploye(e){return(0,c.mG)(this,void 0,void 0,function*(){this.saveRandom.setRetailer(e);const o=yield this.modalController.create({component:m.Y,componentProps:{employe:{flag:"display",data:e}}});return o.onDidDismiss().then(e=>{console.log(e)}),yield o.present()})}}return e.\u0275fac=function(o){return new(o||e)(a.Y36(p.e),a.Y36(l.SH),a.Y36(l.IN),a.Y36(d.l),a.Y36(h.u),a.Y36(u.sk),a.Y36(g.$),a.Y36(y.i))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-employees-list"]],decls:10,vars:2,consts:[["color","primary"],["slot","end"],[3,"click",4,"ngIf"],["slot","start"],["autoHide","false"],["pager","true"],[4,"ngFor","ngForOf"],[3,"click"],["slot","icon-only","name","add"],[1,"ion-text-center","ion-text-uppercase"],[4,"ngIf"],["src","../../assets/user.png"],["class","role",4,"ngFor","ngForOf"],["color","primary","fill","clear",3,"click"],["name","add",1,"btnicone"],["color","danger","fill","clear",3,"click"],["name","trash",1,"btnicone"],["color","success","fill","clear",3,"click"],["name","contact",1,"btnicone"],[1,"role"]],template:function(e,o){1&e&&(a.TgZ(0,"ion-header"),a.TgZ(1,"ion-toolbar",0),a._UZ(2,"ion-title"),a.TgZ(3,"ion-buttons",1),a.YNc(4,f,2,0,"ion-button",2),a.qZA(),a.TgZ(5,"ion-buttons",3),a._UZ(6,"ion-menu-button",4),a.qZA(),a.qZA(),a.qZA(),a.TgZ(7,"ion-content"),a.TgZ(8,"ion-slides",5),a.YNc(9,b,11,3,"ion-slide",6),a.qZA(),a.qZA()),2&e&&(a.xp6(4),a.Q6J("ngIf",o.admin),a.xp6(5),a.Q6J("ngForOf",o.multiStoreEmploye))},directives:[l.Gu,l.sr,l.wd,l.Sm,i.O5,l.fG,l.W2,l.Hr,i.sg,l.YG,l.gu,l.A$,l.jY,l.Nd,l.wI,l.q_,l.yh,l.Ie,l.BJ,l.Q$],pipes:[Z.X$],styles:[""]}),e})()}];let q=(()=>{class e{}return e.\u0275fac=function(o){return new(o||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[i.ez,n.u5,l.Pc,s.Bz.forChild(k),Z.aw.forChild()]]}),e})()}}]);