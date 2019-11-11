import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from '@ionic/angular';
import { Album } from 'src/app/models/Album';
import { Artist } from 'src/app/models/Artist';
import { AuthService } from '../../services/AuthService';
import { FirestoreService } from '../../services/FirestoreService';
import { AlbumPage } from '../album/album.page';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage implements OnInit{
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
    private modelCtrl: ModalController,
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

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });

    return await toast.present();
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
    this.modelCtrl.dismiss();
  }

  viewAlbum(album: Album) {
    this.navCtrl.push(AlbumPage, { albumId: album.albumId });
  }
  ngOnInit() {}
}
