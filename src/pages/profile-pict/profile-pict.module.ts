import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePictPage } from './profile-pict';

@NgModule({
  declarations: [
    ProfilePictPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePictPage),
  ],
})
export class ProfilePictPageModule {}
