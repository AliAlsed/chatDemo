import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController, Platform, AlertController, ToastController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import firebase from 'firebase';
import { AdduserProvider } from '../../providers/adduser/adduser';
import { DatabaseProvider } from '../../providers/database/database';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { RequestsProvider } from '../../providers/requests/requests';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  @ViewChild('content') content: Content;
  buddy: any;
  newmessage;
  key: any;
  allmessages = [];
  res = [];
  ses=[];
  photoURL;
  imgornot;
  show = false;
  constructor(public sqlite: SQLite, public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
    public events: Events, public zone: NgZone, public loadingCtrl: LoadingController,
    public imgstore: ImghandlerProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public userP: AdduserProvider,
    public keys:RequestsProvider,
    public _DatabaseProvider: DatabaseProvider,
    private toastCtrl: ToastController) {
    if (this.platform.ready) {
      this.buddy = this.chatservice.friend;
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.scrollto();
      this.events.subscribe('newmessage', () => {
        this.allmessages = [];
        this.imgornot = [];
        this.zone.run(() => {
          this.allmessages = this.chatservice.friendmessages;
          for (var key in this.allmessages) {
            if (this.allmessages[key].message.substring(0, 4) == 'http')
              this.imgornot.push(true);
            else
              this.imgornot.push(false);
          }
        })


      })
    }
  }

  addmessage() {
    //this.newmessage
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getfriendmessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })

  }
  

  ionViewDidLoad() {
    this._DatabaseProvider.readKeys(this.buddy.uid).then((val)=>{
      this.key=val;
    })
    this.keys.getsessionkey().on("value", (snapshot) => {
      snapshot.forEach((snap) => {        
        this.res.push(snap.val().ks)
        this.ses.push(snap.key)
        
        return false;
      })
    })
    this.userP.getuserdetails().then((res: any) => {
      console.log(res)
      if (this.buddy.job == "patient") {
        this.show = true;
      }
    })
    console.log(this.key);
  }
  goStatus(buddy) {
    this.navCtrl.push('StatusPage', { 'patient': buddy });
  }
}
