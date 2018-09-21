import { RequestsProvider } from './../providers/requests/requests';
import { ChatProvider } from './../providers/chat/chat';
import { DataServiceProvider } from './../providers/data-service/data-service';
import { FirebaseProvider } from './../providers/firebase/firebase';
import { ImghandlerProvider } from './../providers/imghandler/imghandler';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { AngularFireDatabaseModule,AngularFireDatabase } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage'
import {config} from './firebase.config';
import { AdduserProvider } from '../providers/adduser/adduser';
import { GroupsProvider } from '../providers/groups/groups';
import { StatusProvider } from '../providers/status/status';
import { InfoPage } from '../pages/info/info';
import { DatabaseProvider } from '../providers/database/database';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseProvider,
    AngularFireDatabase,
    AdduserProvider,
    ImghandlerProvider,
    Camera,
    DataServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ChatProvider,
    RequestsProvider,
    GroupsProvider,
    StatusProvider,
    SQLite,
    DatabaseProvider
  ]
})
export class AppModule {}
