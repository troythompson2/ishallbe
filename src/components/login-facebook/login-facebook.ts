import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Platform, Events } from 'ionic-angular';
import { Pro } from '@ionic/pro';
import { Facebook } from '@ionic-native/facebook';
import { Observable } from 'rxjs/Observable';
import moment from 'moment';

import { HomePage } from '../../pages/home/home';

import firebase from 'firebase';
import { FirebaseProvider } from '../../providers/firebase/firebase';

import { User } from '../../../test-data/users/model';

@Component({
  selector: 'login-facebook',
  templateUrl: 'login-facebook.html'
})
export class LoginFacebookComponent {

  uid: any;
  authToken: any;
  user: any;
  loader: any;
  registering = false;
  timestamp: number;
  displayTimestamp: string;

  constructor(
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private platform: Platform,
    private facebook: Facebook,
  ) {
  }

  authenticate() {
    this.loader = this.loadingCtrl.create({ 
      spinner: 'bubbles',
      content: 'Loading...' 
    });
    this.loader.present();
    this.timeStampPage();
    this.determineAuthType(this.platform.is('cordova'));
  }

  timeStampPage() {
    this.timestamp = moment().unix();
    this.displayTimestamp = moment().format('MMM D YYYY h:mmA');
  }

  determineAuthType(cordova) {
    if (cordova) {
      this.cordovaAuth();
    } else { this.browserAuth(); }
  }

  cordovaAuth() {
    this.facebook.login(['email', 'public_profile']).then((token) => {
      this.facebook.getAccessToken().then((accessToken) => {
        let facebookProviderCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
        firebase.auth().signInWithCredential(facebookProviderCredential).then((token) => {
          this.unpackageCordovaAuthToken(token);
        }).catch((error) => { this.errorHandler(error) });;
      }).catch((error) => { this.errorHandler(error) });
    }).catch((error) => { this.errorHandler(error) });
  }

  unpackageCordovaAuthToken(token) {
    this.uid = token.uid;
    this.authToken = token.providerData[0];
    let photoURL = "https://graph.facebook.com/" + token.providerData[0].uid + "/picture?type=large";
    let data = {
      "name": token.providerData[0].displayName,
      "email": token.providerData[0].email,
      "photo": photoURL,
    }
    this.authToken = data;
    this.loadUser();
  }

  browserAuth() {
    firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((token) => {
      this.unpackageBrowserAuthToken(token);
    });
  }

  unpackageBrowserAuthToken(token) {
    this.uid = token.user.uid;
    let photoURL = "https://graph.facebook.com/" + token.user.providerData[0].uid + "/picture?type=large";
    let data = {
      "name": token.user.displayName,
      "email": token.user.email,
      "photo": photoURL,
    }
    this.authToken = data;
    this.loadUser();
  }

  loadUser() {
    this.checkForExistingUser().subscribe((user) => {
      this.user.unsubscribe;
      if (user) { this.login(); this.loader.dismiss() }
      else {
        this.registerUser().subscribe(() => {
          this.login(); this.loader.dismiss();
        }, error => {
          this.firebase.afa.auth.signOut();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
          this.loader.dismiss();
        })
      };
    });
  }

  login() {
    this.events.publish('user:login');
    this.navCtrl.setRoot(HomePage)
  }

  checkForExistingUser() {
    return Observable.create((observer) => {
      let path = '/users/' + this.uid;
      this.user = this.firebase.afs.doc(path);
      return this.user.valueChanges().subscribe((user) => {
        if (!this.registering) observer.next(user);
      })
    });
  }

  registerUser() {
    this.registering = true;
    return Observable.create((observer) => {
      return this.presentEULA().subscribe((accepted) => {
        if (accepted) this.createUser().subscribe((newUserObject) => { 
          observer.next(); 
        });
        else observer.error();
      });
    });
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

  buildUser() {
    console.log("Building User");
    return Observable.create((observer) => {
      const user: User = {
        uid: this.uid,
        fcmToken: this.firebase.fcmToken,
        name: this.authToken.name,
        bio: "",
        email: this.authToken.email,
        photo: this.authToken.photo,
        blocked: false,
        displayTimestamp: this.displayTimestamp,
        timestamp: this.timestamp,
        instagram: "",
        linkedin: "",
        twitter: "",
        contributor: true,
        editor: false
      }
      console.log(user);
      observer.next(user);
    });
  }

  createUser() {
    return Observable.create((observer) => {
      this.buildUser().suscbribe((user) => {
        let path = 'users/' + this.uid;
        return this.firebase.afs.doc(path).set(user).then(() => {
          observer.next();
        });
      });
    });
  }

  errorHandler(error) {
    Pro.monitoring.exception(error);
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: error.message,
      buttons: ['OK']
    });
    alert.present();
  }

}
