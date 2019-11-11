import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';


import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';

import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import {
  IonicAudioModule,
  defaultAudioProviderFactory
} from './components/ionic-audio';
import { ComponentsFooterPlayerComponent } from './components/components-footer-player/components-footer-player';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
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
import { SearchPage } from './pages/search/search.page';

@NgModule({
  declarations: [
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
    LoginDetailsPage,
    ComponentsFooterPlayerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
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
export class AppModule { }
