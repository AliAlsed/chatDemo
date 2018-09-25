import { Component } from '@angular/core';
import { Events, NavController, AlertController, NavParams, IonicPage, App, ToastController, Platform } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { RequestsProvider } from '../../providers/requests/requests';
import { DatabaseProvider } from '../../providers/database/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AngularFireAuth } from 'angularfire2/auth';



@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  myrequests;
  myfriends;
  sessionkey: any;
  constructor(public app: App,
    public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public chatservice: ChatProvider
    , private toastCtrl: ToastController,
    public platform: Platform,
    public afireauth: AngularFireAuth,
    public sQLite: SQLite) {
  }


  ionViewWillEnter() {
    this.requestservice.getmyrequests();
    this.requestservice.getmyfriends();
    this.myfriends = [];
    this.events.subscribe('gotrequests', () => {
      this.myrequests = [];
      this.myrequests = this.requestservice.userdetails;
    })
    this.events.subscribe('friends', () => {
      this.myfriends = [];
      this.myfriends = this.requestservice.myfriends;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotrequests');
    this.events.unsubscribe('friends');
  }
  accept(item) {
    this.requestservice.acceptrequest(item).then(() => {

      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: 'Tap on the friend to chat with him',
        buttons: ['Okay']
      });
      newalert.present();
    })
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

  friendchat(myfriends) {
    this.chatservice.initializefriend(myfriends);
    this.requestservice.getmykey(myfriends.uid).then((res: any) => {
      this.sessionkey = res.sessionkey;
      console.log(this.sessionkey);
      this.addKey(myfriends.uid, this.sessionkey);
      this.app.getRootNav().push('ChatsPage');
    })
  }
  addfriends() {
    this.app.getRootNav().push('SearchUserPage');
    //this.app.getRootNav()
  }
  addKey(id, key) {
    this.platform.ready().then(()=>{
    this.sQLite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS keys(rowid INTEGER PRIMARY KEY ,userId TEXT, friendId TEXT UNIQUE, key TEXT)')
      .then(() => {
        db.executeSql('INSERT INTO keys VALUES(NULL ,?,?,? )',
          [id, this.afireauth.auth.currentUser.uid, key]).then(res => {
            /// add home page
            let toast = this.toastCtrl.create({
              message: `it is done  ${res}`,
              duration: 3000,
              position: 'top'
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });

            toast.present();

          }, (err) => {
            let toast = this.toastCtrl.create({
              message: `User add field ${err}`,
              duration: 3000,
              position: 'bottom'
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });

            toast.present();
          })


      }).catch(e => console.log(e));


    });
  });
  }

}
