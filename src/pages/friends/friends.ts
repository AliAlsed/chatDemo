import { Component } from '@angular/core';
import { Events, NavController, AlertController, NavParams, IonicPage, App, ToastController, Platform } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { RequestsProvider } from '../../providers/requests/requests';
import { DatabaseProvider } from '../../providers/database/database';
import { SQLite } from '@ionic-native/sqlite';
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
  res=[];
  ses=[];
  constructor(public app: App,
    public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
    public events: Events,
    public alertCtrl: AlertController,
    public chatservice: ChatProvider
    , public database:DatabaseProvider,
    public platform: Platform,
    public afireauth: AngularFireAuth,
    public sQLite: SQLite) {
  }
  ionViewDidLoad() {
    this.requestservice.getsessionkey().on("value", (snapshot) => {
      snapshot.forEach((snap) => {        
        this.res.push(snap.val().ks)
        this.ses.push(snap.key)
        
        return false;
      })
    })
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

    this.requestservice.acceptrequest(item,this.res[0]).then(() => {
      let newalert = this.alertCtrl.create({
        title: 'Friend added',
        subTitle: `Tap on the friend to chat with him ${this.res[0]}`,
        buttons: ['Okay']
      });
      newalert.present();
    }).then(()=>{
      this.requestservice.removesession(this.ses[0]);
    })
    console.log(item+"  "+this.res[0]);
  }

  ignore(item) {
    this.requestservice.deleterequest(item).then(() => {

    }).catch((err) => {
      alert(err);
    })
  }

  friendchat(myfriends) {
    this.chatservice.initializefriend(myfriends);
    
      this.database.readKeys(myfriends.uid).then((val)=>{
        if(val ==null){
          this.requestservice.getmykey(myfriends.uid).then((res: any) => {
            this.sessionkey = res.sessionkey;
            this.database.addKey(myfriends.uid, this.sessionkey).then(()=>{
              this.requestservice.removekey(myfriends.uid);
            });
          })
        }else{
          console.log(val)
        }


      this.app.getRootNav().push('ChatsPage');
    })
  }
  addfriends() {
    this.app.getRootNav().push('SearchUserPage');
    //this.app.getRootNav()
  }

}
