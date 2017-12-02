import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, NavParams, } from 'ionic-angular';

import {} from 'jasmine';

import { HomePage } from '../home/home';
import { LoginPage } from './login';
import { RegisterPage } from '../register/register';

import {
  NavMock
} from '../../../test-config/mocks-ionic';

describe('Login Page', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage),
      ],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: NavParams, useClass: NavMock },        
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

  it('should have a null login form on load then not null when changed', () => {
    expect(component.login.email).toBe(undefined);
    expect(component.login.password).toBe(undefined); 
    component.logForm('myEmail', 'password');
    fixture.detectChanges();
    expect(component.submitted).toBe(true);
    expect(component.login.email).toBe('myEmail'); 
    expect(component.login.password).toBe('password');       
  });

  it('should initialize with submitted false', () => {
    expect(component.submitted).toBe(false);
  });

  it('should navigate to home page if loggedIn is true', () => {
    expect(component.login.email).toBe(undefined);
    expect(component.login.password).toBe(undefined); 
    component.logForm('myEmail', 'password');
    fixture.detectChanges();
    expect(component.loggedIn).toBe(true);
  }); 

});
