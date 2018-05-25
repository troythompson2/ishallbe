import { Component } from '@angular/core';
import { trigger, 
  style, 
  transition, 
  animate, 
  query, 
  keyframes,
  stagger } from '@angular/animations';

import { IonicPage, NavController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import moment from 'moment';

import { PostPage } from '../post/post';

import { AboutPage } from '../about/about';

import { FirebaseProvider } from '../../providers/firebase/firebase';

@IonicPage()
@Component({
  selector: 'page-ishallbetv',
  templateUrl: 'ishallbetv.html',
  animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true }),

        query(':leave', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ]),
    trigger('explainerAnimation', [
      transition('* => *', [
        query('.col', style({ opacity: 0, transform: 'translateX(-40px)' })),

        query('.col', stagger('500ms', [
          animate('800ms 1.2s ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ])),

        query('.col', [
          animate(1000, style('*'))
        ])

      ])
    ])
  ],
})
export class IshallbetvPage {

  currentMonday: number;
  videos: any[] = [];

  constructor(
    private navCtrl: NavController,
    private firebase: FirebaseProvider
  ) {
  }

  ionViewDidLoad() {
    this.setLastMonday();
    this.loadVideos().subscribe((videos) => {
      this.setVideos(videos);
    });
  }

  setLastMonday() {
    let today = parseInt(moment().format('YYYYMMDD'));
    let dayNumber = moment().isoWeekday();
    this.currentMonday = today - dayNumber;
  }

  loadVideos() {
    return Observable.create((observer) => {
      let allVideos = this.firebase.afs.collection('pins', ref =>
        ref.where('day', '==', 'Monday').
          orderBy('postDate', 'desc').
            startAfter(this.currentMonday));
      allVideos.valueChanges().subscribe((videos) => {
        observer.next(videos);
      });
    });
  }

  setVideos(videos) {
    this.videos = [];
    videos.forEach((video) => {
      if (video.day == 'Monday') {
        video.displayAffirmationDate = moment(video.displayAffirmationDate).fromNow();
        this.videos.push(video);
      }
    });
  }

  pushAboutPage() {
    this.navCtrl.push(AboutPage);
  }

  openPin(pin) {
    this.navCtrl.push(PostPage, {
      id: pin.id,
      type: "pins"
    });
  }

  refreshPage(refresh) {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
