import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import {
  IonicAudioModule,
  defaultAudioProviderFactory
} from './components/ionic-audio';
import { ComponentsFooterPlayerComponent } from './components/components-footer-player/components-footer-player';
import { MusicControls } from '@ionic-native/music-controls';
import { BackgroundMode } from '@ionic-native/background-mode';
import { HomePage } from './pages/home/home.page';
import { BrowsePage } from './pages/browse/browse.page';
import { LibraryPage } from './pages/library/library.page';
import { TabsPage } from './pages/tabs/tabs.page';
import { LoginPage } from './pages/login/login.page';
import { PlaylistPage } from './pages/playlist/playlist.page';
import { MusicPlayerPage } from './pages/music-player/music-player.page';
import { ArtistPage } from './pages/artist/artist.page';
import { AlbumPage } from './pages/album/album.page';
import { FavoritesPage } from './pages/favorites/favorites.page';
import { SettingsPage } from './pages/settings/settings.page';
import { ProfilePage } from './pages/profile/profile.page';
import { GenrePage } from './pages/genre/genre.page';
import { LoginDetailsPage } from './pages/login-details/login-details.page';
import { AuthService } from './services/AuthService';
import { FirestoreService } from './services/FirestoreService';
import { AudioService } from './services/AudioService';
import { SearchPageModule } from './pages/search/search.page';

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'firebase_api_key_here',
    authDomain: 'kadacheptaadmin.firebaseapp.com',
    databaseURL: 'https://kadacheptaadmin.firebaseio.com',
    projectId: 'kadacheptaadmin',
    storageBucket: 'kadacheptaadmin.appspot.com',
    messagingSenderId: '874870342380',
    appId: '1:874870342380:web:da6fb393c0a55cd96d9bc9',
    measurementId: 'G-GDTSXCB5YY'
  };

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    BrowsePage,
    SearchPageModule,
    LibraryPage,
    TabsPage,
    LoginPage,
    PlaylistPage,
    MusicPlayerPage,
    ArtistPage,
    AlbumPage,
    FavoritesPage,
    SettingsPage,
    ProfilePage,
    GenrePage,
    LoginDetailsPage,
    ComponentsFooterPlayerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    IonicAudioModule.forRoot(defaultAudioProviderFactory)
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    HomePage,
    BrowsePage,
    SearchPage,
    LibraryPage,
    TabsPage,
    LoginPage,
    PlaylistPage,
    MusicPlayerPage,
    ArtistPage,
    AlbumPage,
    FavoritesPage,
    SettingsPage,
    ProfilePage,
    GenrePage,
    LoginDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    FirestoreService,
    AudioService,
    Facebook,
    GooglePlus,
    TwitterConnect,
    MusicControls,
    BackgroundMode  
  ]
})
export class AppModule {}
