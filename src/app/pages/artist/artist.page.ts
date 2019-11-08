import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController
} from '@ionic/angular';

import { FirestoreService } from '../../services/FirestoreService';
import { AuthService } from '../../services/AuthService';

import { AlbumPage } from '../album/album.page';

import { ViewController } from '@ionic/core';
import { Album } from 'src/app/models/Album';
import { Artist } from 'src/app/models/Artist';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {
  userId: string;
  isFollowing = false;

  artistId: string;
  artist: Artist = new Artist();
  albums: Album[] = [];

  loadedAlbums = false;
  loadedFollowing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.artistId = navParams.get('artistId');

    this.authService.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArtistPage');

    this.getArtist();
    this.getArtistAlbums();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AlbumPage');
    this.getIsFollowingArtist();
  }

  getIsFollowingArtist() {
    this.firestoreService
      .getIsFollowingArtist(this.userId, this.artist)
      .then((result: any) => {
        this.isFollowing = result.isFollowing;
        this.loadedFollowing = true;
      });
  }

  followArtist() {
    this.firestoreService.followArtist(this.userId, this.artist).then(() => {
      this.isFollowing = true;
      this.showToast('Following \'' + this.artist.name + '\'');
    });
  }

  unfollowArtist() {
    this.firestoreService.unfollowArtist(this.userId, this.artist).then(() => {
      this.isFollowing = false;
      this.showToast('Unfollowing \'' + this.artist.name + '\'');
    });
  }

  showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  getArtist() {
    this.firestoreService.getArtist(this.artistId).then((result: any) => {
      this.artist = result.artist;
      this.getIsFollowingArtist();
    });
  }

  getArtistAlbums() {
    this.firestoreService.getArtistAlbums(this.artistId).then((result: any) => {
      this.albums = result.albums;
      this.loadedAlbums = true;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  viewAlbum(album: Album) {
    this.navCtrl.push(AlbumPage, { albumId: album.albumId });
  }
}
