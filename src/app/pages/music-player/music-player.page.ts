import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { Song } from 'src/app/models/Song';
import { AudioService } from 'src/app/services/AudioService';
import { AuthService } from 'src/app/services/AuthService';
import { FirestoreService } from 'src/app/services/FirestoreService';
import { AlbumPage } from '../album/album.page';
import { ArtistPage } from '../artist/artist.page';

@Component({
  selector: 'page-music-player',
  templateUrl: 'music-player.html'
})
export class MusicPlayerPage implements OnInit {
  userId: string;
  isLiked = false;
  playingSong: Song;
  isLikeLoaded = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private audioService: AudioService,
    private actionSheetCtrl: ActionSheetController,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.authService.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MusicPlayerPage');

    this.getSong();
  }

  getSong() {
    const playingTrack = this.audioService.playingTrack();

    this.firestoreService.getSong(playingTrack.songId).then((result: any) => {
      this.playingSong = result.song;
      this.getSongLikeStatus();
    });
  }

  getSongLikeStatus() {
    this.firestoreService
      .getSongLikeStatus(this.userId, this.playingSong)
      .then((result: any) => {
        this.isLiked = result.isLiked;
        this.isLikeLoaded = true;
      });
  }

  likeSong() {
    this.firestoreService
      .likeSong(this.userId, this.playingSong)
      .then(() => {
        this.isLiked = true;
      });
  }

  unlikeSong() {
    this.firestoreService
      .unlikeSong(this.userId, this.playingSong)
      .then(() => {
        this.isLiked = false;
      });
  }

  next() {
    this.audioService.next();

    this.isLikeLoaded = false;
    this.getSong();
  }

  previous() {
    this.audioService.previous();

    this.isLikeLoaded = false;
    this.getSong();
  }

  async songActionSheet() {
    const playingTrack = this.audioService.playingTrack();

    const actionSheet = await this.actionSheetCtrl.create({
      header: playingTrack.title + ' ⚬ ' + playingTrack.artist,
      buttons: [
        {
          text: 'View Album',
          role: 'viewAlbum',
          icon: 'md-musical-notes',
          handler: () => {
            this.gotToAlbum(playingTrack.albumId);
          }
        },
        {
          text: 'View Artist',
          role: 'viewArtist',
          icon: 'md-person',
          handler: () => {
            this.goToArtist(playingTrack.artistId);
          }
        }
      ]
    });

    return await actionSheet.present();
  }

  gotToAlbum(albumId: string) {
    this.navCtrl.push(AlbumPage, { albumId: albumId });
  }

  goToArtist(artistId: string) {
    this.navCtrl.push(ArtistPage, { artistId: artistId });
  }

  close() {
    this.modalCtrl.dismiss();
  }
  
  ngOnInit() {}
}
