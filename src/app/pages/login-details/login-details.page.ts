import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavParams } from '@ionic/angular';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'page-login-details',
  templateUrl: 'login-details.html'
})
export class LoginDetailsPage implements OnInit {
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

  async signIn() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Logging in...'
    });

    await loading.present();

    this.afService
      .signIn(this.loginData.email, this.loginData.password)
      .then(x => {
        loading.dismiss();
      })
      .catch(async error => {
        loading.dismiss();
        console.log(error);

        const alert = await this.alertCtrl.create({
          header: 'Log In Error',
          subHeader: error.message,
          buttons: ['Dismiss']
        });

        return await alert.present();
      });
  }

  async signUp() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Signing up...'
    });

    loading.present();

    this.afService
      .registerUser(
        this.registerData.email,
        this.registerData.password      )
      .then(x => {
        loading.dismiss();
      })
      .catch(async error => {
        loading.dismiss();

        const alert = await this.alertCtrl.create({
          header: 'Sign Up Error',
          subHeader: error.message,
          buttons: ['Dismiss']
        });

        return await alert.present();
      });
  }

  forgotPassword(): void {
    this.afService.forgotPassword(this.loginData.email).catch(async error => {
      const alert = await this.alertCtrl.create({
        header: 'Password Reset',
        subHeader: 'Please enter your email.',
        buttons: ['Dismiss']
      });
      return await alert.present();
    });
  }
  ngOnInit() {}
}
