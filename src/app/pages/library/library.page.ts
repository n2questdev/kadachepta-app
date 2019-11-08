import { Component } from '@angular/core';
import { NavController, ActionSheetController, Events } from '@ionic/angular';

import { AuthService } from '../../services/AuthService';
import { FirestoreService } from '../../services/FirestoreService';
import { AudioService } from '../../services/AudioService';

import { ProfilePage } from '../profile/profile.page';
import { AlbumPage } from '../album/album.page';
import { ArtistPage } from '../artist/artist.page';
import { SettingsPage } from '../settings/settings.page';
import { FavoritesPage } from '../favorites/favorites.page';

import { Song } from '../../data/Song';
import { FavoriteType } from '../../data/FavoriteType';

@Component({
  selector: 'page-library',
  templateUrl: 'library.html'
})
export class LibraryPage {
  userId: string;
  userPicture: string;

  recentlyPlayedSongs: Song[] = [];
  tracks: any[] = [];
  loaded = false;

  constructor(
    public navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private audioService: AudioService,
    private events: Events
  ) {
    this.authService.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userPicture = user.photoURL;
      }
    });

    this.events.subscribe('updateSongIsPlaying', () => {
      this.updateSongIsPlaying();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LibraryPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter LibraryPage');

    this.getRecentlyPlayed();
    this.updateSongIsPlaying();
  }

  updateSongIsPlaying() {
    if (this.loaded && this.audioService.playingTrack() !== undefined) {
      this.recentlyPlayedSongs.forEach(song => {
        if (song.songId == this.audioService.playingTrack().songId) {
          song.isPlaying = true;
        } else {
          song.isPlaying = false;
        }
      });
    }
  }

  getRecentlyPlayed() {
    this.firestoreService.getRecentlyPlayed(this.userId).then((result: any) => {
      this.recentlyPlayedSongs = result.recentlyPlayed;

      this.recentlyPlayedSongs.forEach(song => {
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

      this.loaded = true;
      this.updateSongIsPlaying();
    });
  }

  goToFavouritePlaylists() {
    this.navCtrl.push(FavoritesPage, { favoriteType: FavoriteType.Playlist });
  }

  goToFavouriteSongs() {
    this.navCtrl.push(FavoritesPage, { favoriteType: FavoriteType.Song });
  }

  goToFavouriteAlbums() {
    this.navCtrl.push(FavoritesPage, { favoriteType: FavoriteType.Album });
  }

  goToFavouriteArtists() {
    this.navCtrl.push(FavoritesPage, { favoriteType: FavoriteType.Artist });
  }

  playRecentSong(trackIndex: number) {
    if (this.audioService.setTracksAndPlay(this.tracks, trackIndex)) {
      this.firestoreService.addSongToRecentlyPlayed(
        this.userId,
        this.recentlyPlayedSongs[trackIndex]
      );

      this.updateSongIsPlaying();

      this.recentlyPlayedSongs = [];
      this.getRecentlyPlayed();
    }
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage);
  }

  songActionSheet(song: Song) {
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
}
