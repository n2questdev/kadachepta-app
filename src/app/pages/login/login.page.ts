import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  LoadingController,
  Platform
} from '@ionic/angular';

import { BackgroundMode } from '@ionic-native/background-mode/ngx';
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

  async signInWithFacebook() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Logging in with Facebook...'
    });

    loading.present();

    this.authService
      .signInWithFacebookPlugin()
      .then(() => {
        loading.dismiss();
      })
      .catch(error => {
        // Known Ionic View restriction
        if (error === 'plugin_not_installed') {
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

  async signInWithGoogle() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Logging in with Google...'
    });

    loading.present();

    this.authService
      .signInWithGooglePlugin()
      .then(() => {
        loading.dismiss();
      })
      .catch(error => {
        // Known Ionic View restriction
        if (error === 'plugin_not_installed') {
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

  async signInWithTwitter() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Logging in with Twitter...'
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
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Ionic View Login Error',
        subHeader:
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

      return await alert.present();
    });
  }

  async handleFacebookLoginError(error: string) {
    const alert = await this.alertCtrl.create({
      header: 'Facebook Login Error',
      subHeader: error,
      buttons: ['Dismiss']
    });

    return await alert.present();
  }

  async handleGoogleLoginError(error: string) {
    const alert = await this.alertCtrl.create({
      header: 'Google Login Error',
      subHeader: error,
      buttons: ['Dismiss']
    });

    return await alert.present();
  }

  async handleTwitterLoginError(error: string) {
    const alert = await this.alertCtrl.create({
      header: 'Twitter Login Error',
      subHeader: error,
      buttons: ['Dismiss']
    });

    return await alert.present();
  }

  signInWithGithub(): void {
    this.authService.signInWithGithub().catch(async error => {
      const alert = await this.alertCtrl.create({
        header: 'Github Login Error',
        subHeader: error.message,
        buttons: ['Dismiss']
      });

      return await alert.present();
    });
  }
}
