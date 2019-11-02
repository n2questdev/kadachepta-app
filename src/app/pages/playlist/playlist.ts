import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ActionSheetController,
  ToastController,
  Events
} from '@ionic/angular';

import { FirestoreService } from '../../services/FirestoreService';
import { AudioService } from '../../services/AudioService';
import { AuthService } from '../../services/AuthService';

import { AlbumPage } from '../album/album';
import { ArtistPage } from '../artist/artist';

import { Song } from '../../data/Song';
import { Playlist } from '../../data/Playlist';
import { ViewController } from '@ionic/core';

@Component({
  selector: 'page-playlist',
  templateUrl: 'playlist.html'
})
export class PlaylistPage {
  userId: string;
  isFollowing = false;

  playlist: Playlist = new Playlist();
  songs: Song[] = [];
  tracks: any[] = [];

  loadedSongs = false;
  loadedFollowing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private firestoreService: FirestoreService,
    private actionSheetCtrl: ActionSheetController,
    private audioService: AudioService,
    private authService: AuthService,
    private events: Events
  ) {
    this.playlist = navParams.get('playlist');

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
    console.log('ionViewDidLoad PlaylistPage');

    this.getPlaylistSongs();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter PlaylistPage');

    this.getIsFollowingPlaylist();
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

  getIsFollowingPlaylist() {
    this.firestoreService
      .getIsFollowingPlaylist(this.userId, this.playlist)
      .then((result: any) => {
        this.isFollowing = result.isFollowing;
        this.loadedFollowing = true;
      });
  }

  followPlaylist() {
    this.firestoreService
      .followPlaylist(this.userId, this.playlist)
      .then(() => {
        this.isFollowing = true;
        this.showToast('Following \'' + this.playlist.name + '\'');
      });
  }

  unfollowPlaylist() {
    this.firestoreService
      .unfollowPlaylist(this.userId, this.playlist)
      .then(() => {
        this.isFollowing = false;
        this.showToast('Unfollowing \'' + this.playlist.name + '\'');
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

  getPlaylistSongs() {
    this.firestoreService
      .getPlaylistSongs(this.playlist)
      .then((result: any) => {
        this.songs = result.playlistSongs;

        this.songs.forEach(song => {
          var track = {
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

  playlistSongActionSheet(song: Song) {
    const actionSheet = this.actionSheetCtrl.create({
      title: song.name + ' ⚬ ' + song.artistName,
      buttons: [
        {
          text: 'View Album',
          role: 'viewAlbum',
          icon: 'md-musical-notes',
          handler: () => {
            this.gotToAlbum(song);
          }
        },
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

    actionSheet.present();
  }

  gotToAlbum(song: Song) {
    this.navCtrl.push(AlbumPage, { albumId: song.albumId });
  }

  goToArtist(song: Song) {
    this.navCtrl.push(ArtistPage, { artistId: song.artistId });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
