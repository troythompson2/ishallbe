import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PostPage } from '../../pages/post/post';

@Component({
  selector: 'statement',
  templateUrl: 'statement.html'
})
export class StatementComponent {
  @Input('post') statement;

  constructor(
    private navCtrl: NavController
  ) {
  }

  viewStatement() {
    this.navCtrl.push(PostPage, { 
      id: this.statement.id,
      type: "statements",
      opened: true
     });
  }

}
