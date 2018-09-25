import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { StatusProvider } from '../../providers/status/status';
import { InfoPage } from '../info/info';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular/platform/platform';

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {
   id:any;
   data:any;
  constructor(public _StatusProvider:StatusProvider,
    public navCtrl: NavController,
     public navParams: NavParams
     , public sqlite:SQLite,
     private toastCtrl: ToastController
     , public platform:Platform) {
  }

  ionViewDidLoad() {
    this.id=this.navParams.get('patient').uid;
    this.getKey();
  }
  info(dgree){
    this.navCtrl.push(InfoPage,{
      'id':this.id,
      'persent':dgree
    })
  }
  getKey() {
    this.platform.ready().then(()=>{
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM keys')
          .then(res => {
            let toast = this.toastCtrl.create({
              message: `User was added successfully ${res}`,
              duration: 3000,
              position: 'top'
            });
            toast.present();
            this.data=[];
            
              for (var i = 0; i < res.rows.length; i++) {
                this.data.push({
                  id:res.rows.item(i).rowid,
                  user:res.rows.item(i).userId,
                  friend:res.rows.item(i).friendId,
                  key:res.rows.item(i).key,
                })
              
            }
          }, (err) => {
              let toast = this.toastCtrl.create({
                message: `User was added successfully ${err.message}`,
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
          })

      })
    })
  }


}
