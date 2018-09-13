import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,
    statusBar: StatusBar, splashScreen: SplashScreen,public afAuth: AngularFireAuth) {
    platform.ready().then(() => {
      const authObserver = afAuth.authState.subscribe( user => {
        if (user) {
          this.rootPage = 'TabsPage';
          authObserver.unsubscribe();
        } else {
          this.rootPage = HomePage;
          authObserver.unsubscribe();
        }
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

