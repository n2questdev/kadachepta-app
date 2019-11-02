import { Component } from '@angular/core';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
