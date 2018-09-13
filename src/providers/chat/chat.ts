import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  friendChat = firebase.database().ref('/friendchats');
  friend: any;
  friendmessages = [];
  _useroneSignal = firebase.database().ref(`UserOneSignal/`);

  constructor(public events: Events) {

  }

  initializefriend(friend) {
    this.friend = friend;
  }

  addnewmessage(msg) {
    if (this.friend) {
      var promise = new Promise((resolve, reject) => {
        this.friendChat.child(firebase.auth().currentUser.uid).child(this.friend.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.friendChat.child(this.friend.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() =>{
            resolve(true);
          })






              })
          })

        return promise;
      }
    }

  getfriendmessages() {
    let temp;
    this.friendChat.child(firebase.auth().currentUser.uid).child(this.friend.uid).on('value', (snapshot) => {
      this.friendmessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.friendmessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }
}
