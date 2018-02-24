import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(
    public iab: InAppBrowser
  ) {
  }

  openLink(){
    this.iab.create('https://iShallBe.co', '_system');
  }
  
}
