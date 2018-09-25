import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content, LoadingController, Platform, AlertController, ToastController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { ImghandlerProvider } from '../../providers/imghandler/imghandler';
import firebase from 'firebase';
import { AdduserProvider } from '../../providers/adduser/adduser';
import { DatabaseProvider } from '../../providers/database/database';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

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
  photoURL;
  imgornot;
  show = false;
  constructor(public sqlite: SQLite, public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
    public events: Events, public zone: NgZone, public loadingCtrl: LoadingController,
    public imgstore: ImghandlerProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public userP: AdduserProvider,
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
  getKey() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM keys WHERE friendid=?', [this.buddy.uid])
          .then(res => {
            let toast = this.toastCtrl.create({
              message: `User was added successfully ${res}`,
              duration: 3000,
              position: 'top'
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });

            toast.present();

            if (res.rows.length > 0) {
              this.key = res.rows.item(0).key;
              let toast = this.toastCtrl.create({
                message: `User was added successfully ${res.rows.item(0)}`,
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            }
          }, (err) => {
              let toast = this.toastCtrl.create({
                message: `User was added successfully ${err}`,
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
          })

      })
  }

  ionViewDidLoad() {
    this.getKey();
    this.userP.getuserdetails().then((res: any) => {
      console.log(res)
      if (this.buddy.job == "patient") {
        console.log(true);
        console.log(this.buddy)
        this.show = true;
      }
    })

  }
  goStatus(buddy) {
    this.navCtrl.push('StatusPage', { 'patient': buddy });
  }
}
