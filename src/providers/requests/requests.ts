import { request } from './../../models/request';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AdduserProvider } from '../adduser/adduser';
import firebase from 'firebase';
import { UUID } from 'angular2-uuid';
/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  firesession = firebase.database().ref('/keysession');
  firefriends = firebase.database().ref('/friends');
  firekey = firebase.database().ref('/keys');
  userdetails;
  myfriends;
  constructor(public userservice: AdduserProvider, public events: Events) {

  }

  sendrequest(req: request) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(req.recipient).push({
      sender: req.sender
      }).then(() => {
        resolve({ success: true });
        })
    })
    return promise;
  }

  getmyrequests() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.userservice.getallusers().then((res) => {
        var allusers = res;
        this.userdetails = [];
        for (var j in myrequests)
          for (var key in allusers) {
            if (myrequests[j] === allusers[key].uid) {
              this.userdetails.push(allusers[key]);
            }
          }
        this.events.publish('gotrequests');
      })

  })
  }

  acceptrequest(buddy,uuid) {
    var promise = new Promise((resolve, reject) => {
      this.myfriends = [];
      this.firefriends.child(firebase.auth().currentUser.uid).push({
        uid: buddy.uid,
        
      }).then(() => {
        this.firefriends.child(buddy.uid).push({
          uid: firebase.auth().currentUser.uid,
          sessionkey:uuid
        }).then(() => {
          this.deleterequest(buddy).then(() => {
        this.firekey.child(firebase.auth().currentUser.uid).child(buddy.uid).set({
          sessionkey:uuid
        }).then(()=>{
          this.firekey.child(buddy.uid).child(firebase.auth().currentUser.uid).set({
            sessionkey:uuid
          })
        })
          resolve(true);
        })

        })
        })
    })
    return promise;
  }

  deleterequest(buddy) {
    var promise = new Promise((resolve, reject) => {
     this.firereq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(buddy.uid).once('value', (snapshot) => {
          let somekey;
          for (var key in snapshot.val())
            somekey = key;
          this.firereq.child(firebase.auth().currentUser.uid).child(somekey).remove().then(() => {
            resolve(true);
          })
         })
          .then(() => {

        }).catch((err) => {
          reject(err);
        })
    })
    return promise;
  }

  getmyfriends() {
    let friendsuid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();
      this.myfriends = [];
      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);

      this.userservice.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in users) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })

    })
  }
  getmykey(friend){
    var promise = new Promise((resolve, reject) => {
      this.firekey.child(firebase.auth().currentUser.uid).child(friend).once('value', (snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }
  getsessionkey():firebase.database.Reference{
      return this.firesession;
  }
  removesession(key){
    return this.firesession.child(key).remove();
  }
  removekey(friend){
   return this.firekey.child(firebase.auth().currentUser.uid).child(friend).child('sessionkey').remove();
  }


}
