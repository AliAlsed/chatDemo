import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { DataSnapshot } from '@firebase/database';
/*
  Generated class for the StatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StatusProvider {
  firestate = firebase.database().ref('/Status');
  status:any;
  constructor() {
    console.log('Hello StatusProvider Provider');
  }
  getuserStatus(id,state):firebase.database.Reference {
    return this.firestate.child(id).child(state);
}
}
