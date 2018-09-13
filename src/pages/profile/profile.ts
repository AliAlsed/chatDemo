import { userProfile } from './../../models/userProfile';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { AdduserProvider } from '../../providers/adduser/adduser';
import { HomePage } from '../home/home';
import {Storage} from '@ionic/storage';
import { error } from '@firebase/database/dist/esm/src/core/util/util';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage{
  public name:any;
  public email:any;
  public dob:any;
  profile ={
    name:'',
    email:'',
    dob:'',
    job:'',
    photoURL:'',
    phone:''
  }
   constructor(public fr:FirebaseProvider,public userPro:AdduserProvider,
    public database:AngularFireDatabase,public Data:DataServiceProvider,
     public nav:NavController,public app:App, public loadingCtrl:LoadingController) {

  }


  public userImage:any;

  loader = this.loadingCtrl.create({
    content: 'Please wait....'
  });
  ionViewWillEnter() {
    this.loader.present();
    //getuserdetails()
    this.userPro.getuserdetails().then((res:any) =>{
        console.log(res);
        this.profile.photoURL=res.photoURL;
        this.profile.name=res.displayName;
        this.profile.email=res.email;
        this.profile.dob=res.dob;
        this.profile.job=res.job;
        this.profile.phone=res.phone;

      }).catch(err =>{
        alert(error);
       });

      this.loader.dismiss();




  }
ionViewDidLoad(){

  }

  logout(){
    this.fr.logoutUser();
    this.app.getRootNav().setRoot(HomePage);
  }

}
