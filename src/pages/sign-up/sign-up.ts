import { Component } from '@angular/core';
import { IonicPage, NavController, Loading,LoadingController,AlertController, NavParams } from 'ionic-angular';
import { AdduserProvider } from '../../providers/adduser/adduser';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  public loading: Loading;
  constructor(    public navCtrl: NavController,
    public authProvider: AdduserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController  ) {
    }
    newuser = {
      email: '',
      password: '',
      displayName: '',
      DOB:'',
      job:'',
      phone:''
    }

    signupUser(){
         console.log(this.newuser.job)
        this.authProvider.adduser(this.newuser,this.newuser.job)
        .then(() => {
          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot('ProfilePictPage');
          });
        }, (error) => {
          this.loading.dismiss().then( () => {
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
        });
        this.loading = this.loadingCtrl.create();
        this.loading.present();
      }
      launchLogin(){
        this.navCtrl.setRoot('LoginPage');
      }
    }


