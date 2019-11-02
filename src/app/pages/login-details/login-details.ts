import { Component } from '@angular/core';
import { NavParams, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'page-login-details',
  templateUrl: 'login-details.html'
})
export class LoginDetailsPage {
  isLogin: boolean;
  loginData: any;
  registerData: any;

  constructor(
    private navParams: NavParams,
    private afService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.isLogin = this.navParams.get('isLogin');
    this.loginData = { email: '', password: '' };
    this.registerData = { email: '', password: '', password2: '' };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginDetailsPage');
  }

  signIn(): void {
    var loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in...'
    });

    loading.present();

    this.afService
      .signIn(this.loginData.email, this.loginData.password)
      .then(x => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        console.log(error);

        let alert = this.alertCtrl.create({
          title: 'Log In Error',
          subTitle: error.message,
          buttons: ['Dismiss']
        });

        alert.present();
      });
  }

  signUp(): void {
    var loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Signing up...'
    });

    loading.present();

    this.afService
      .registerUser(
        this.registerData.email,
        this.registerData.password,
        this.registerData.password2
      )
      .then(x => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();

        let alert = this.alertCtrl.create({
          title: 'Sign Up Error',
          subTitle: error.message,
          buttons: ['Dismiss']
        });

        alert.present();
      });
  }

  forgotPassword(): void {
    this.afService.forgotPassword(this.loginData.email).catch(error => {
      let alert = this.alertCtrl.create({
        title: 'Password Reset',
        subTitle: 'Please enter your email.',
        buttons: ['Dismiss']
      });
      alert.present();
    });
  }
}
