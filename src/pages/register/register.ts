import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registerForm: {
    name?: string
    email?: string,
    password?: string
  } = {};
  submitted = false;
  uid: any;
  profile: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private firebase: FirebaseProvider,
  ) {
  }

  submit(registerForm) {
    this.submitted = true;
    if (registerForm.valid) {
      this.presentEULA().subscribe((accepted) => {
        if (accepted) {
          let loading = this.loadingCtrl.create({ content: 'Please Wait..' });
          loading.present();
          this.buildUser(registerForm)
          this.register(registerForm).then(() => {
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }).catch((error) => { this.errorHandler(error); loading.dismiss() });
        }
      })
    };
  }

  presentEULA() {
    return Observable.create((observer: any) => {
      let alert = this.alertCtrl.create({
        title: 'Accept Terms of Service',
        message: 'Please confirm to continue',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              observer.next(false);
            }
          },
          {
            text: 'Confirm',
            handler: () => {
              observer.next(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

  buildUser(registerForm) {
    this.registerForm = registerForm;
    this.profile = {
      name: registerForm.name,
      email: registerForm.email,
      photo: "assets/img/default-profile.png",
      blocked: false,
      uid: "default",
      roles: {
        subscriber: true,
        partner: false,
        contractor: false
      }
    }
  }

  register(registerForm) {
    return this.firebase.register(registerForm).then((token) => {
      this.uid = token.uid
      this.profile.uid = token.uid
      return this.createUser().then(() => {
      }, (error) => { throw error });
    }, (error) => { throw error });
  }

  createUser() {
    let path = '/users/' + this.profile.uid;
    return this.firebase.afs.doc(path).set(this.profile);
  }

  errorHandler(error) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: error.message,
      buttons: ['OK']
    });
    alert.present();
  }

  setRootLoginPage() {
    this.navCtrl.setRoot(LoginPage);
  }
}