import { Component} from '@angular/core';
import { IonicPage, LoadingController, NavController} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
import {Storage} from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdduserProvider } from '../../providers/adduser/adduser';
@IonicPage()
@Component({
  selector: 'page-profile-pict',
  templateUrl: 'profile-pict.html',
})
export class ProfilePictPage {
  userPhoto;
  currentPhoto;
  imgSource;
  firedata = firebase.database().ref('/profileimages');
  constructor(public addUser:AdduserProvider,private camera:Camera, public loadingCtrl:LoadingController
  ,public navCtrl:NavController,  public storage:Storage
 ,public afireauth:AngularFireAuth) {
  }
  loader = this.loadingCtrl.create({
    content: 'Please wait....'
  });
  takePhoto(){
    const galleryOptions: CameraOptions = {
     quality:95,
     allowEdit: true,
     destinationType: this.camera.DestinationType.DATA_URL,
     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
     encodingType:this.camera.EncodingType.JPEG,
     targetWidth: 720,
     targetHeight: 720,
     correctOrientation: true
   }
   this.camera.getPicture(galleryOptions).then((imageData) =>{
     this.loader.present();
     this.userPhoto=this.dataUrltoBlob('data:image/jbeg;base64,'+imageData);
     this.upload();

   },(error) => {
     // upload failed
     console.log(error);
   })
 }

 dataUrltoBlob(url){
  let binary=atob(url.split(',')[1]);
  let array=[];
  for(let i=0;i<binary.length;i++){
    array.push(binary.charCodeAt(i))
  }
return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
}

upload(){
if(this.userPhoto){
  let userId=firebase.auth().currentUser.uid;
  this.loader.dismiss();
  firebase.storage().ref().child(`/images/${userId}`).put(this.userPhoto).then(this.onSuccess,this.onerrors);
}
}

onerrors=(err)=>{
  console.log(err)
  this.loader.dismiss();
}
onSuccess=(snapshot)=>
{
this.currentPhoto=snapshot.downloadURL;
this.firedata.child(this.afireauth.auth.currentUser.uid).set({
  img:this.currentPhoto
});
this.addUser.updateimage(this.currentPhoto);
this.storage.set('ProfilePict',this.currentPhoto);
this.loader.dismiss();
this.getMyUrl();
//this.navCtrl.setRoot('UserProfileInfoPage');
}
next(){

  this.navCtrl.setRoot('TabsPage');
}
getMyUrl(){
  let userId=firebase.auth().currentUser.uid;
  firebase.storage().ref().child(`/images/${userId}`).getDownloadURL().then((url)=>{
    this.imgSource=url;

  });
}

}
