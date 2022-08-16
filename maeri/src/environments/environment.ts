// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//export let uri = 'http://localhost:3030/';
export let uri = 'http://localhost:3000/';
//export let uri = 'http://18.157.225.135:3000/';
//export let uri = 'http://192.168.1.155:3000/';
// "http://ec2-35-158-183-204.eu-central-1.compute.amazonaws.com:3000/"; 658565173
//"http://18.157.225.135:3000/"
export const environment = {
  production: false,
};
//export const uri = 675253130
//  "http://ec2-18-194-208-2.eu-central-1.compute.amazonaws.com:3000/";
/*
export const uri =
  "http://ec2-54-93-231-124.eu-central-1.compute.amazonaws.com:3000/";
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * 
 * <ion-searchbar type="text" debounce="500" (ionChange)="getItems($event)"></ion-searchbar>
     <ion-list *ngIf="isItemAvailable">
         <ion-item *ngFor="let item of items">{{ item }}</ion-item>
     </ion-list>


      // Declare the variable (in this case and initialize it with false)
     isItemAvailable = false;
     items = [];

     initializeItems(){
         this.items = ["Ram","gopi", "dravid"];
     }

     getItems(ev: any) {
         // Reset items back to all of the items
         this.initializeItems();

         // set val to the value of the searchbar
         const val = ev.target.value;

         // if the value is an empty string don't filter the items
         if (val && val.trim() !== '') {
             this.isItemAvailable = true;
             this.items = this.items.filter((item) => {
                 return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
             })
         } else {
             this.isItemAvailable = false;
         }
     }
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.  693503173// 658565173
//C:\Users\erico\angular4app\projet\School\myschool2\src\pages
