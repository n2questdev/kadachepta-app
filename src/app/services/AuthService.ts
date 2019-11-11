import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, Platform } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {
  public authState: AngularFireAuth;
  uid: any;

  constructor(
    private alertCtrl: AlertController,
    public afAuth: AngularFireAuth,
    private platform: Platform,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private twitter: TwitterConnect
  ) {
    afAuth.authState.subscribe((user: firebase.User) => {
      if (user) {
        this.uid = user.uid;
      } else {
        this.uid = null;
      }
    });
  }

  async signInWithFacebookPlugin() {
    if (this.platform.is('cordova')) {
      try {
        const res = await this.fb
          .login(['email']);
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase
          .auth()
          .signInWithCredential(facebookCredential)
          .then(() => { }, err => {
            console.error('Error: ', err);
            throw err;
          });
      } catch (error) {
        throw error;
      }
    } else {
      return this.signInWithFacebookWeb();
    }
  }

  async signInWithFacebookWeb() {
    try {
      await this
        .afAuth
        .auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider());
    } catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  }

  async signInWithGooglePlugin() {
    if (this.platform.is('cordova')) {
      try {
        const res = await this.googlePlus
          .login({
            webClientId: '395983984847-84m1jgom088b1d8jdn36v6rspaov5nhp.apps.googleusercontent.com',
            offline: true
          });
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase
          .auth()
          .signInWithCredential(googleCredential)
          .then(response => {
            console.log('Firebase success: ' + JSON.stringify(response));
          });
      } catch (err) {
        console.error('Error: ', err);
        throw err;
      }
    } else {
      return this.signInWithGoogleWeb();
    }
  }

  async signInWithGoogleWeb() {
    try {
      await this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  }

  async signInWithTwitterPlugin() {
    if (this.platform.is('cordova')) {
      try {
        const result = await this.twitter.login();
        console.log('Successful login!');
        console.log(result);
      } catch (error) {
        console.error('Error logging in');
        console.error(error);
        throw error;
      }
    } else {
      return this.signInWithTwitterWeb();
    }
  }

  async signInWithTwitterWeb() {
    try {
      await this.afAuth.auth
        .signInWithPopup(new firebase.auth.TwitterAuthProvider());
    } catch (err) {
      console.error('Error: ', err);
      throw err;
    }
  }

  async signInWithGithub() {
    await this.afAuth.auth
      .signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  async registerUser(email, password) {
    try {
      await this.afAuth.auth
        .createUserWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      await this.afAuth.auth
        .signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  signOut(): void {
    firebase.auth().signOut();
  }

  async forgotPassword(email: string) {
    try {
      await firebase
        .app()
        .auth()
        .sendPasswordResetEmail(email);
      const alert = await this.alertCtrl.create({
        header: 'Password Reset',
        subHeader: 'Check your inbox to reset your password',
        buttons: ['Dismiss']
      });
      await alert.present();
    } catch (error) {
      throw error;
    }
  }
}
