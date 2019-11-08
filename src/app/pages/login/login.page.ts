import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  Platform
} from '@ionic/angular';

import { BackgroundMode } from '@ionic-native/background-mode';
import { AuthService } from 'src/app/services/AuthService';
import { LoginDetailsPage } from '../login-details/login-details.page';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(
    private app: AppModule,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private backgroundMode: BackgroundMode
  ) {
    this.platform.registerBackButtonAction(() => {
      let activeNav = this.app.getActiveNav();

      if (activeNav.getActive().name === 'ModalCmp') {
        activeNav.getActive().dismiss();
      } else if (activeNav.canGoBack()) {
        activeNav.pop();
      } else {
        this.backgroundMode.moveToBackground();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToLogin() {
    this.navCtrl.push(LoginDetailsPage, { isLogin: true });
  }

  goToSignup() {
    this.navCtrl.push(LoginDetailsPage, { isLogin: false });
  }

  signInWithFacebook() {
    var loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in with Facebook...'
    });

    loading.present();

    this.authService
      .signInWithFacebookPlugin()
      .then(() => {
        loading.dismiss();
      })
      .catch(error => {
        // Known Ionic View restriction
        if (error == 'plugin_not_installed') {
          this.showIonicViewErrorMessage().then(() => {
            this.authService
              .signInWithFacebookWeb()
              .then(() => {
                loading.dismiss();
              })
              .catch(error => {
                loading.dismiss();
                this.handleFacebookLoginError(error.message);
              });
          });
        } else {
          loading.dismiss();
          this.handleFacebookLoginError(error.message);
        }
      });
  }

  signInWithGoogle(): void {
    var loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in with Google...'
    });

    loading.present();

    this.authService
      .signInWithGooglePlugin()
      .then(() => {
        loading.dismiss();
      })
      .catch(error => {
        // Known Ionic View restriction
        if (error == 'plugin_not_installed') {
          this.showIonicViewErrorMessage().then(() => {
            this.authService
              .signInWithGoogleWeb()
              .then(() => {
                loading.dismiss();
              })
              .catch(error => {
                loading.dismiss();
                this.handleGoogleLoginError(error.message);
              });
          });
        } else {
          loading.dismiss();
          this.handleGoogleLoginError(error.message);
        }
      });
  }

  signInWithTwitter(): void {
    var loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in with Twitter...'
    });

    loading.present();

    this.authService
      .signInWithTwitterPlugin()
      .then(() => {
        loading.dismiss();
      })
      .catch(error => {
        // Known Ionic View restriction
        if (error == 'plugin_not_installed') {
          this.showIonicViewErrorMessage().then(() => {
            this.authService
              .signInWithTwitterWeb()
              .then(() => {
                loading.dismiss();
              })
              .catch(error => {
                loading.dismiss();
                this.handleTwitterLoginError(error.message);
              });
          });
        } else {
          loading.dismiss();
          this.handleTwitterLoginError(error.message);
        }
      });
  }

  showIonicViewErrorMessage() {
    return new Promise((resolve) => {
      let alert = this.alertCtrl.create({
        title: 'Ionic View Login Error',
        subTitle:
          'Ionic View does not currently support this login plugin. Logging in using web...',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              alert.dismiss().then(() => {
                resolve();
              });
            }
          }
        ]
      });

      alert.present();
    });
  }

  handleFacebookLoginError(error) {
    let alert = this.alertCtrl.create({
      title: 'Facebook Login Error',
      subTitle: error,
      buttons: ['Dismiss']
    });

    alert.present();
  }

  handleGoogleLoginError(error) {
    let alert = this.alertCtrl.create({
      title: 'Google Login Error',
      subTitle: error,
      buttons: ['Dismiss']
    });

    alert.present();
  }

  handleTwitterLoginError(error) {
    let alert = this.alertCtrl.create({
      title: 'Twitter Login Error',
      subTitle: error,
      buttons: ['Dismiss']
    });

    alert.present();
  }

  signInWithGithub(): void {
    this.authService.signInWithGithub().catch(error => {
      let alert = this.alertCtrl.create({
        title: 'Github Login Error',
        subTitle: error.message,
        buttons: ['Dismiss']
      });

      alert.present();
    });
  }
}
