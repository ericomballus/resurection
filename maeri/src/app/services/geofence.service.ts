import { Injectable } from '@angular/core';
//import { Geofence } from "@ionic-native/geofence/ngx";
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GeofenceService {
  constructor(private plateform: Platform) {
    if (this.plateform.is('android')) {
    }
  }

  addGeofence(lat, lng) {
    //options describing geofence
    let fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude: lat, //center of geofence radius
      longitude: lng,
      radius: 2, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: {
        //notification settings
        id: 1, //any unique ID
        title: 'You crossed a fence', //notification title
        text: 'You just arrived to your company.', //notification body
        openAppOnClick: true, //open app when notification is tapped
      },
    };
  }
}
