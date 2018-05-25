import { Component, ViewChild } from '@angular/core';

import { IonicPage, NavController, Platform, Slides } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';

import { NotificationsPage } from '../notifications/notifications';
import { StatementCreatorPage } from '../statement-creator/statement-creator';
import { GoalCreatorPage } from '../goal-creator/goal-creator';

import { Observable } from 'rxjs';
import moment from 'moment';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slider: Slides;

  pins: any[] = [];
  statements: any[] = [];
  goals: any[] = [];
  lastStatementTimestamp: number;
  lastGoalTimestamp: number;
  postStartDate: number;
  postEndDate: number;
  dayNumber: number;
  timestamp: number;
  dayOfWeek: string;
  pinsLoaded = false;
  goalsLoaded = false;
  newNotifications = false;
  noMoreStatements = false;
  noMoreGoals = false;
  postSegment = 'statements';

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private fcm: FCM,
    private firebase: FirebaseProvider
  ) {
  }

  ionViewDidEnter() {
    this.timestampPage();
    this.checkForNewNotifications();
    this.loadPosts();
    if (this.platform.is('cordova')) {
      this.listenToFCMPushNotifications();
    }
  }

  timestampPage() {
    this.timestamp = moment().unix();
    this.dayNumber = moment().isoWeekday();
    this.dayOfWeek = moment().format('dddd');
    this.postEndDate = parseInt(moment().format('YYYYMMDD'));
    this.postStartDate = parseInt(moment().subtract(this.dayNumber, 'days').format('YYYYMMDD'));
  }

  listenToFCMPushNotifications() {
    this.fcm.getToken().then(token => {
      this.firebase.fcmToken = token
      this.firebase.syncFcmToken();
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      this.firebase.fcmToken = token;
      this.firebase.syncFcmToken();
    });
  }

  checkForNewNotifications() {
    let newNotifications = this.firebase.afs.collection('notifications', ref =>
      ref.where("receiverUid", "==", this.firebase.user.uid).
        where("read", "==", false).
        where("message", "==", false));
    newNotifications.valueChanges().subscribe((myNewNotifications) => {
      if (myNewNotifications.length > 0) this.newNotifications = true;
      else this.newNotifications = false;
    });
  }

  loadPosts() {
    this.loadPins();
    this.loadStatements();
    this.loadGoals();
  }

  loadPins() {
    let pins = this.firebase.afs.collection('pins', ref =>
      ref.orderBy('postDate').
        startAt(this.postStartDate).
        endAt(this.postEndDate));
    pins.valueChanges().subscribe((pins) => {
      if (!this.pinsLoaded) {
        this.setPins(pins).subscribe(() => {
          this.pinsLoaded = true;
          this.setSlider();
        });
      }
    });
  }

  setPins(pins) {
    return Observable.create((observer) => {
      pins.forEach((pin) => {
        this.pins.push(pin);
      });
      observer.next();
    });
  }

  setSlider() {
    setTimeout(() => {
      this.slider.slideTo(this.dayNumber);
    }, 500);
  }

  loadStatements() {
    let statements = this.firebase.afs.collection('statements', ref =>
      ref.where('private', '==', false).
        where('reported', '==', false)
        .orderBy('timestamp', 'desc').
        limit(5));
    statements.valueChanges().subscribe((statements) => {
      if (statements.length > 0) {
          this.setStatements(statements);
          if (statements.length < 5) this.noMoreStatements = true;
      } else {
          this.noMoreStatements = true;
      }
    });
  }

  setStatements(statements) {
    statements.forEach((statement) => {
      let date = moment.unix(statement.timestamp);
      statement.displayTimestamp = moment(date).fromNow();
      this.statements.push(statement);
    });
    let lastStatement = this.statements.pop();
    this.lastStatementTimestamp = lastStatement.timestamp;
  }

  loadGoals() {
    let goals = this.firebase.afs.collection('goals', ref =>
      ref.where('private', '==', false).
        where('reported', '==', false).
        where('complete', '==', false).
        where('dueDate', '>', this.timestamp).
        orderBy('dueDate', 'asc').
        limit(5));
    goals.valueChanges().subscribe((goals) => {
      if (goals.length > 0) {
          this.setGoals(goals);
          if (goals.length < 5) {
            this.noMoreGoals = true
          } 
      } else {
        this.noMoreGoals = true;
      }
    });
  }

  setGoals(goals) {
    goals.forEach((goal) => {
      let dueDate = moment.unix(goal.dueDate);
      goal.displayDueDate = moment(dueDate).fromNow();
      let timestamp = moment.unix(goal.timestamp);
      goal.displayTimestamp = moment(timestamp).fromNow();
      this.goals.push(goal);
    });
    this.goalsLoaded = true;
  }

  loadMoreStatements(event) {
    return new Promise((resolve) => {
      let statements = this.firebase.afs.collection('statements', ref =>
        ref.where('private', '==', false).
          where('reported', '==', false)
          .orderBy('timestamp', 'desc').
          limit(5).
          startAfter(this.lastStatementTimestamp));
      return statements.valueChanges().subscribe((statements) => {
        if (statements.length > 0 ) this.setStatements(statements);
        if (statements.length < 5 ) this.endStatementsInfinityScroll(event);
        resolve();
      });
    });
  }

  endStatementsInfinityScroll(event) {
    event.complete();
    this.noMoreStatements = true;
  }


  loadMoreGoals(event) {
    return new Promise((resolve) => {
      let goals = this.firebase.afs.collection('goals', ref =>
        ref.where('private', '==', false).
          where('reported', '==', false)
          .orderBy('timestamp', 'desc').
          limit(5).
          startAfter(this.lastGoalTimestamp));
      return goals.valueChanges().subscribe((goals) => {
        if (goals.length > 0 ) this.setGoals(goals);
        if (goals.length < 5 ) this.endGoalsInfinityScroll(event);
        resolve();
      });
    });
  }

  endGoalsInfinityScroll(event) {
    event.complete();
    this.noMoreGoals = true;
  }

  showNotifications() {
    this.navCtrl.push(NotificationsPage);
  }

  refreshPage(refresh) {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  setRootStatementCreatorPage() {
    this.navCtrl.setRoot(StatementCreatorPage);
  }

  setRootGoalCreatorPage() {
    this.navCtrl.setRoot(GoalCreatorPage);
  }
}