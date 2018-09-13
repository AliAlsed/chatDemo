import { User } from './../../models/usercards.interface';
import { Component } from '@angular/core';
import {IonicPage, Loading,LoadingController, NavController,AlertController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from '../../providers/firebase/firebase'


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
   credeintials ={} as User;
   public loading: Loading;

   constructor(public fire:FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
      private authService: FirebaseProvider ,
      private alertCtrl: AlertController) {}

   onSignin() {
     this.authService.signinUser(this.credeintials).then( () => {
       this.navCtrl.setRoot('TabsPage');


    }, (error) => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
      });
  }

      signup() {
        this.navCtrl.setRoot('SignUpPage');
      }
      reset(){
        this.navCtrl.push('ResetPasswordPage');
      }

}
