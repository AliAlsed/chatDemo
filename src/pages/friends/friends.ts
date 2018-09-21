import { Component } from '@angular/core';
import { Events, NavController, AlertController, NavParams, IonicPage, App } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { RequestsProvider } from '../../providers/requests/requests';
import { DatabaseProvider } from '../../providers/database/database';



@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  myrequests;
  myfriends;
  sessionkey:any;
  constructor(public app:App,
    public navCtrl: NavController, public navParams: NavParams, public requestservice: RequestsProvider,
              public events: Events,
               public alertCtrl: AlertController,
                public chatservice: ChatProvider
                , public database: DatabaseProvider) {
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
    //this.app.getRootNav().push('ChatsPage');
      this.requestservice.getmykey(myfriends.uid).then((res:any)=>{
        this.sessionkey=res.sessionkey;
        console.log(this.sessionkey);
        this.database.addKey(myfriends.uid,this.sessionkey).then((res:any)=>{
          alert(res);
        })
      })
  }
  addfriends(){
  this.app.getRootNav().push('SearchUserPage');
  //this.app.getRootNav()
  }

}
