import { Component, NgZone } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './services/AuthService';
import { FirestoreService } from './services/FirestoreService';
import { TabsPage } from './pages/tabs/tabs.page';
import { LoginPage } from './pages/login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  rootPage: any = LoginPage;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private zone: NgZone
  ) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.authService.afAuth.authState.subscribe((user: firebase.User) => {
      console.log(JSON.stringify(user));

      if (user) {
        this.firestoreService.addUser(user);

        this.zone.run(() => {
          this.rootPage = TabsPage;
        });
      }
    });
  }
}
