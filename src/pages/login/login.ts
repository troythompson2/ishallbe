import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { PasswordResetPage } from '../password-reset/password-reset';
import { SignupPage } from '../signup/signup';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: {
    email?: string, 
    password?: string
  } = {};  
  submitted = false;

  constructor(
    private navCtrl: NavController, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private firebase: FirebaseProvider
  ) {
  }

  submit(loginForm) {
    this.submitted = true;
    if (loginForm.valid) {
      let loading = this.loadingCtrl.create({ spinner: 'bubbles', content: 'Please Wait..' });
      loading.present();
      return this.authenticate(loginForm).subscribe(() => { 
        loading.dismiss();
      }, error => { this.errorHandler(error); loading.dismiss(); 
    })};    
  }

  authenticate(loginForm) {
    return Observable.create((observer) => {
      return this.firebase.afa.auth.signInWithEmailAndPassword(loginForm.email, loginForm.password).then(()=> {
        observer.next();
      }, (error) => {
        observer.error(error);
      });
    });
  }

  errorHandler(error) {
    this.firebase.afa.auth.signOut(); 
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: error.message,
      buttons: ['OK']
    });
    alert.present();
  }

  setRootSignupPage() {
    this.navCtrl.setRoot(SignupPage);
  }

  setRootPasswordResetPage() {
    this.navCtrl.setRoot(PasswordResetPage);
  }

}
