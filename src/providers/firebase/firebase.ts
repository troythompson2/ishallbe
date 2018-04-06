import { Injectable } from '@angular/core';

import { AlertController, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import moment from 'moment';

import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';

import { User } from '../../../test-data/users/model';

@Injectable()
export class FirebaseProvider {

  userDoc: any;
  user: any;
  fcmToken: string;
  session = false;
  loaded = false;
  hasSeenTutorial = false;
  deployingUpdate = false;
  signingUp = false;
  socialAuthentication = false;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    public afs: AngularFirestore,
    public afa: AngularFireAuth
  ) {
    if (!this.loaded && !this.deployingUpdate) {
      this.loaded = true;
      this.checkForSession();
    }
    this.listenToPostEvents();
  }

  checkForSession() {
    console.log("Checking for Firebase Session");
    this.sessionExists().subscribe((session) => {
      console.log("Session Exists: ");
      console.log(session);
      if (session) this.userExists();
      else this.endSession();
    });
  }

  endSession() {
    console.log("Ending Session");
    this.session = false;
    this.userDoc = null;
    this.user = null;
    this.loaded = false;
    if (this.afa.auth.currentUser)
      this.afa.auth.signOut();
    this.events.publish('contributor permission not granted');
  }

  sessionExists() {
    return Observable.create((observer) => {
      return this.afa.authState.subscribe((session) => {
        if (session)
          observer.next(true);
        else
          observer.next(false);
      });
    });
  }

  userExists() {
    let userPath = "users/" + this.afa.auth.currentUser.uid;
    this.userDoc = this.afs.doc(userPath);
    this.userDoc.valueChanges().subscribe((user) => {
      console.log("Existing User: ");
      console.log(user)
      if (!user)
        this.registerUser();
      else if (user.blocked) {
        this.blockUser();
      } else {
        this.startSession(user);
      }
    });
  }

  blockUser() {
    console.log("Blocking User");
    this.endSession();
    let alert = this.alertCtrl.create({
      title: 'User Blocked',
      message: 'Please contact us at info@ishallbe.co',
      buttons: [
        {
          text: 'Okay'
        }
      ]
    });
    alert.present();
  }

  startSession(user) {
    this.user = user;
    if (this.user.editor) this.events.publish("editor permission granted");
    else this.events.publish("editor permission not granted")
    this.session = true;
    this.socialAuthentication = false;
    this.events.publish('contributor permission granted');
    console.log("Starting Session");
  }

  registerUser() {
    console.log("Registering User");
    console.log("Social Authentication: " + this.socialAuthentication)
    if (this.socialAuthentication) {
      this.signupUser();
    }
    else {
      this.createNonSocialUser().then(() => {
        console.log("Creating non social user");
        console.log(this.afa.auth.currentUser);
        this.signupUser();
      });
    }
  }

  createNonSocialUser() {
    return this.afa.auth.currentUser.updateProfile({
      displayName: "Unnamed User",
      photoURL: "assets/img/default-profile.png"
    });
  }

  signupUser() {
    console.log("Signing Up User");
    this.presentEULA().subscribe((accepted) => {
      if (!accepted) this.deleteUser();
      else {
        this.buildUser().subscribe((user) => {
          this.user = user;
          this.setUser().then(() => {
            this.startSession(user);
          });
        });
      }
    });
  }

  presentEULA() {
    console.log("Presenting EULA");
    return Observable.create((observer: any) => {
      if (!this.signingUp) {
        this.signingUp = true;
        let alert = this.alertCtrl.create({
          title: 'Accept Terms of Service',
          message: 'Please confirm to continue',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                this.signingUp = false;
                observer.next(false);
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                this.signingUp = false;
                observer.next(true);
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  deleteUser() {
    console.log("Deleting User");
    this.afa.auth.currentUser.delete().then(() => {
      this.endSession();
    })
  }

  buildUser() {
    console.log("Building User");
    return Observable.create((observer) => {
      if (!this.fcmToken) this.fcmToken = "0";
      let timestamp = moment().unix();
      let displayTimestamp = moment().format('MMM D YYYY h:mmA');
      const user: User = {
        uid: this.afa.auth.currentUser.uid,
        fcmToken: this.fcmToken,
        name: this.afa.auth.currentUser.displayName,
        bio: "",
        email: this.afa.auth.currentUser.email,
        photo: this.afa.auth.currentUser.photoURL,
        blocked: false,
        displayTimestamp: displayTimestamp,
        timestamp: timestamp,
        instagram: "",
        linkedin: "",
        twitter: "",
        contributor: true,
        editor: false
      }
      console.log("User Built");
      console.log(user);
      observer.next(user);
    });
  }

  setUser() {
    console.log("Setting User");
    let path = '/users/' + this.afa.auth.currentUser.uid;
    return this.afs.doc(path).set(this.user);
  }

  listenToPostEvents() {
    console.log("Listening to post events");
    this.events.subscribe('post deleted', (post) => {
      console.log("Post Deleted");
      console.log(post);
      let postPath = post.collection + "/" + post.id;
      console.log("Post path is " + postPath);
      this.afs.doc(postPath).delete();
    });
  }
}
