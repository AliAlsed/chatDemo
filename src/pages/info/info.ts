import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { StatusProvider } from '../../providers/status/status';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  state:string;
  res=[];
  constructor(public _StatusProvider:StatusProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.get('id'));
    this.state=this.navParams.get('persent');
    this._StatusProvider.getuserStatus(this.navParams.get('id'),this.navParams.get('persent')).on("value", snapshot => {
      snapshot.forEach(snap => {
        console.log(snap.val());
        this.res.push(snap.val())
      })
    })
  }
}
