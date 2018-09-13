import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusProvider } from '../../providers/status/status';
import { InfoPage } from '../info/info';

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
  constructor(public _StatusProvider:StatusProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.id=this.navParams.get('patient').uid;
  }
  info(dgree){
    this.navCtrl.push(InfoPage,{
      'id':this.id,
      'persent':dgree
    })
  }

}
