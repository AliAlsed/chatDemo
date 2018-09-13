import { Injectable } from '@angular/core';
import {userProfile} from '../../models/userProfile'
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import firebase from 'firebase';
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
ProfileList:any;
setProfile:Boolean;
userImage:any;
userid=this.afireauth.auth.currentUser.uid;
firedata = firebase.database().ref('/profileimages');

   constructor(public database:AngularFireDatabase,public afireauth: AngularFireAuth) {

    if(this.userid)
     this.ProfileList=database.list(`/profiles/${this.userid}`);
    }


     saveProfile(profile:userProfile):Promise<any>{
      return new Promise((resolve) =>
      {
      this.ProfileList.push(profile);
     resolve(true);
    })
  }
    getuserdetails() {
     return this.ProfileList;
    }


}
