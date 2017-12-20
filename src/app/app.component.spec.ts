import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NgModule, Component, ViewChild } from '@angular/core';
import { IonicModule, Platform } from 'ionic-angular';
import { AngularFireModule, FirebaseApp, FirebaseAppConfig } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { Push } from '@ionic-native/push';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer'

import { Observable } from 'rxjs/Rx';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { FirebaseProvider } from '../providers/firebase/firebase';

import { iShallBe } from './app.component';

import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock,
  StorageMock,
  FacebookMock,
  FileMock,
  PushMock,
  AngularFireDatabaseMock,
  AngularFireAuthMock,
  FirebaseAppMock,
  FirebaseProviderMock
} from '../../test-config/mocks-ionic';

import { } from 'jasmine';

let fixture;
let component;
let firebase: FirebaseProvider;
let firebaseSpy;

describe('iShallBe App Component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [iShallBe],
      imports: [
        IonicModule.forRoot(iShallBe),
        AngularFireModule.initializeApp(environment.firebase),
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Storage, useClass: StorageMock },
        { provide: Facebook, useClass: FacebookMock },
        { provide: File, useClass: FileMock },
        { provide: Push, useClass: PushMock },
        { provide: AngularFireDatabase, useClass: AngularFireDatabaseMock },
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: FirebaseApp, useClass: FirebaseAppMock },
        { provide: firebase, useClass: FirebaseApp },
        { provide: FirebaseProvider, useClass: FirebaseProviderMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(iShallBe);
    component = fixture.componentInstance;
    firebase = fixture.componentRef.injector.get(FirebaseProvider);
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    firebase = null;
    firebaseSpy = null;
  });

  it('should be created', (done) => {
    expect(component instanceof iShallBe).toBe(true);
    const promise = new Promise((res, rej) => res());
    promise.then(done).catch(done.fail);
  });

  it('should have 1 provider', () => {
    expect(component.providers.length).toBe(1);
  });

  it('should have 5 menu pages', () => {
    expect(component.menuPages.length).toBe(5);
  })

  it('should have 22 pages', () => {
    expect(component.pages.length).toBe(22);
  });

  it('should have 3 components', () => {
    expect(component.components.length).toBe(3);
  });

  it('should initialize with login page as root page', () => {
    expect(component['rootPage']).toBe(LoginPage);
  });

});
