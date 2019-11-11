import { Component } from '@angular/core';
import { ActionSheetController, Events, ModalController, NavController, NavParams, ToastController } from '@ionic/angular';
import { Album } from 'src/app/models/Album';
import { Song } from 'src/app/models/Song';
import { AudioService } from '../../services/AudioService';
import { AuthService } from '../../services/AuthService';
import { FirestoreService } from '../../services/FirestoreService';
import { ArtistPage } from '../artist/artist.page';

@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})
export class AlbumPage {
  userId: string;
  isFollowing = false;

  albumId: string;
  album: Album = new Album();
  songs: Song[] = [];
  tracks: any[] = [];

  loadedSongs = false;
  loadedFollowing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private firestoreService: FirestoreService,
    private actionSheetCtrl: ActionSheetController,
    private audioService: AudioService,
    private authService: AuthService,
    private events: Events
  ) {
    this.albumId = navParams.get('albumId');

    this.authService.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.events.subscribe('updateSongIsPlaying', () => {
      this.updateSongIsPlaying();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlbumPage');

    this.getAlbum();
    this.getAlbumSongs();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter AlbumPage');

    this.getIsFollowingAlbum();
    this.updateSongIsPlaying();
  }

  updateSongIsPlaying() {
    if (this.loadedSongs && this.audioService.playingTrack() !== undefined) {
      this.songs.forEach(song => {
        if (song.songId == this.audioService.playingTrack().songId) {
          song.isPlaying = true;
        } else {
          song.isPlaying = false;
        }
      });
    }
  }

  getIsFollowingAlbum() {
    this.firestoreService
      .getIsFollowingAlbum(this.userId, this.album)
      .then((result: any) => {
        this.isFollowing = result.isFollowing;
        this.loadedFollowing = true;
      });
  }

  followAlbum() {
    this.firestoreService.followAlbum(this.userId, this.album).then(() => {
      this.isFollowing = true;
      this.showToast('Following \'' + this.album.name + '\'');
    });
  }

  unfollowAlbum() {
    this.firestoreService.unfollowAlbum(this.userId, this.album).then(() => {
      this.isFollowing = false;
      this.showToast('Unfollowing \'' + this.album.name + '\'');
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

  getAlbum() {
    this.firestoreService.getAlbum(this.albumId).then((result: any) => {
      this.album = result.album;
    });
  }

  getAlbumSongs() {
    this.firestoreService.getAlbumSongs(this.albumId).then((result: any) => {
      this.songs = result.songs;

      this.songs.forEach(song => {
        const track = {
          src: song.songUrl,
          artist: song.artistName,
          title: song.name,
          art: song.albumPicture,
          preload: 'metadata', // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
          songId: song.songId,
          artistId: song.artistId,
          albumId: song.albumId
        };

        this.tracks.push(track);
      });

      this.loadedSongs = true;
      this.updateSongIsPlaying();
    });
  }

  playSong(trackIndex: number) {
    if (this.audioService.setTracksAndPlay(this.tracks, trackIndex)) {
      this.firestoreService.addSongToRecentlyPlayed(
        this.userId,
        this.songs[trackIndex]
      );
      this.updateSongIsPlaying();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async songActionSheet(song: Song) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: song.name + ' ⚬ ' + song.artistName,
      buttons: [
        {
          text: 'View Artist',
          role: 'viewArtist',
          icon: 'md-person',
          handler: () => {
            this.goToArtist(song);
          }
        }
      ]
    });

    return await actionSheet.present();
  }

  goToArtist(song: Song) {
    this.navCtrl.push(ArtistPage, { artistId: song.artistId });
  }
}
