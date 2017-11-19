import {NgModule, ErrorHandler } from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { HttpModule } from '@angular/http';
import {Sean} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { Push } from '@ionic-native/push';
import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';

// start import pages
import {LoginPage} from '../pages/login/login';
import {RegisterPage} from '../pages/register/register';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';
import {HomePage} from '../pages/home/home';
import {AboutPage} from '../pages/about/about';
import {PortfolioPage} from '../pages/portfolio/portfolio';
import {ServicesPage} from '../pages/services/services';
import {ContactPage} from '../pages/contact/contact';
import {AccountPage} from '../pages/account/account';
import {AccountPhotoPage} from '../pages/account-photo/account-photo';
import {AccountPasswordPage} from '../pages/account-password/account-password';
import {AccountNamePage} from '../pages/account-name/account-name';
import {AccountEmailPage} from '../pages/account-email/account-email';
import {CaptureImagePage} from '../pages/capture-image/capture-image';
import {SelectImagePage} from '../pages/select-image/select-image';
import {CaptureVideoPage} from '../pages/capture-video/capture-video';
import {ClientPage} from '../pages/client/client';
import {ContractorPage} from '../pages/contractor/contractor';
import {CollabPage} from '../pages/collab/collab';
import {PartnerPage} from '../pages/partner/partner';
import {TabsPage} from '../pages/tabs/tabs';
import {TutorialPage} from '../pages/tutorial/tutorial'
// end import pages

// start import providers
import {UserProvider} from '../providers/user/user';
import {ContentProvider} from '../providers/content/content';
// end import providers

@NgModule({
  declarations: [
    Sean,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    HomePage,
    AboutPage,
    PortfolioPage,
    ServicesPage,
    ContactPage,
    AccountPage,
    AccountPhotoPage,
    AccountPasswordPage,
    AccountNamePage,
    AccountEmailPage,
    SelectImagePage,
    CaptureVideoPage,
    CollabPage,    
    ClientPage,
    ContractorPage,
    PartnerPage,
    TabsPage,
    TutorialPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Sean, {}, { links: [] }),
    IonicStorageModule.forRoot(),
    HttpModule   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Sean,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    HomePage,
    AboutPage,
    PortfolioPage,
    ServicesPage,
    ContactPage,
    AccountPage,
    AccountPhotoPage,
    AccountPasswordPage,
    AccountNamePage,
    AccountEmailPage,
    SelectImagePage,
    CaptureVideoPage,
    CollabPage,
    ClientPage,    
    ContractorPage,
    PartnerPage,
    TabsPage,
    TutorialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    ContentProvider,  
    Push,
    File,
    Facebook,
    Camera,
    MediaCapture,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }