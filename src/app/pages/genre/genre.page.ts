import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, ModalController } from '@ionic/angular';
import { ViewController } from '@ionic/core';
import { Genre } from 'src/app/models/Genre';
import { Song } from 'src/app/models/Song';
import { AudioService } from '../../services/AudioService';
import { AuthService } from '../../services/AuthService';
import { FirestoreService } from '../../services/FirestoreService';
import { AlbumPage } from '../album/album.page';
import { ArtistPage } from '../artist/artist.page';

@Component({
  selector: 'page-genre',
  templateUrl: 'genre.html'
})
export class GenrePage implements OnInit {
  userId: string;

  genre: Genre;
  genreSongs: Song[] = [];
  tracks: any[] = [];

  loadedSongs = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private firestoreService: FirestoreService,
    private audioService: AudioService,
    private authService: AuthService,
    private events: Events
  ) {
    this.genre = this.navParams.get('genre');

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
    console.log('ionViewDidLoad GenrePage');
    this.getGenreSongs();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter GenrePage');

    this.updateSongIsPlaying();
  }

  updateSongIsPlaying() {
    if (this.loadedSongs && this.audioService.playingTrack() !== undefined) {
      this.genreSongs.forEach(song => {
        if (song.songId == this.audioService.playingTrack().songId) {
          song.isPlaying = true;
        } else {
          song.isPlaying = false;
        }
      });
    }
  }

  getGenreSongs() {
    this.firestoreService.getGenreSongs(this.genre).then((result: any) => {
      this.genreSongs = result.genreSongs;

      this.genreSongs.forEach(song => {
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
        this.genreSongs[trackIndex]
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

    return await actionSheet.present();
  }

  gotToAlbum(song: Song) {
    this.navCtrl.push(AlbumPage, { albumId: song.albumId });
  }

  goToArtist(song: Song) {
    this.navCtrl.push(ArtistPage, { artistId: song.artistId });
  }
  ngOnInit() {}
}
