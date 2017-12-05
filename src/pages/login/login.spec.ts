import { ComponentFixture, async, tick, TestBed, fakeAsync } from '@angular/core/testing';
import { IonicModule, Events, NavController, NavParams, } from 'ionic-angular';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/first';

import { } from 'jasmine';

import { HeaderComponent } from '../../components/header/header';
import { SocialFacebookComponent } from '../../components/social-facebook/social-facebook';

import { HomePage } from '../home/home';
import { LoginPage } from './login';
import { RegisterPage } from '../register/register';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SessionProvider } from '../../providers/session/session';

import {
  NavMock,
  FirebaseProviderMock,
  SessionProviderMock,
  StorageMock
} from '../../../test-config/mocks-ionic';

let fixture;
let component;
let session: SessionProvider;
let sessionSpy;

describe('Login Page', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage),
        IonicStorageModule.forRoot()
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: NavParams, useClass: NavMock },
        { provide: FirebaseProvider, useClass: FirebaseProviderMock },
        { provide: SessionProvider, useClass: SessionProviderMock },
        { provide: Storage, useClass: StorageMock}
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    session = fixture.componentRef.injector.get(SessionProvider);    
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    session = null;
    sessionSpy = null;
  });

  it('should be created', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

  it('should display header component', () => {
    let de: DebugElement;
    let el: HTMLElement;
    de = fixture.debugElement.query(By.css('header'));
    el = de.nativeElement.src;
    expect(el).toBeUndefined();
  });  

  it('should have submission array defined', () => {
    expect(component.submission).toBeDefined();
  });

  it('should have submitted variable defined as false', () => {
    expect(component.submitted).toBe(false);
  });

  it('should trigger session editor login if user is editor on login', () => {
    spyOn(session, 'loginEditor').and.returnValue;
    let submission = {
      email: 'test@tdct.io',
      password: 'password'
    }
    component.submitLoginForm(submission);
    fixture.detectChanges();
    expect(session.loginEditor).toHaveBeenCalledTimes(1);
  });

  it('should display facebook component', () => {
    let de: DebugElement;
    let el: HTMLElement;
    de = fixture.debugElement.query(By.css('social-facebook'));
    el = de.nativeElement.src;
    expect(el).toBeUndefined();
  });

  it('should store user in session provider after login', () => {
    spyOn(session, 'storeUser').and.returnValue;
    let submission = {
      email: 'test@tdct.io',
      password: 'password'
    }
    component.submitLoginForm(submission);
    fixture.detectChanges();
  });

});
