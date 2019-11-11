import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}
}
