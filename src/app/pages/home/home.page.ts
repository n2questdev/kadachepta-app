import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Playlist } from 'src/app/models/Playlist';
import { PlaylistGroup } from 'src/app/models/PlaylistGroup';
import { FirestoreService } from 'src/app/services/FirestoreService';
import { PlaylistPage } from '../playlist/playlist.page';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  playlistGroups: PlaylistGroup[] = [];
  playingTrack: any;

  loadedPlaylists = false;

  constructor(
    private firestoreService: FirestoreService,
    private modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.getPlaylistGroups();
  }

  getPlaylistGroups(): void {
    this.firestoreService.getPlaylistGroups().then((result: any) => {
      this.playlistGroups = result.playlistGroups;

      this.playlistGroups.forEach(playlistGroup => {
        this.firestoreService
          .getPlaylistGroupPlaylists(playlistGroup)
          .then((result: any) => {
            playlistGroup.playlists = result.playlistGroupPlaylists;
          });
      });

      this.loadedPlaylists = true;
    });
  }

  async goToPlaylist(playlist: Playlist) {
    const modal = await this.modalCtrl.create(PlaylistPage, { playlist: playlist });
    return await modal.present();
  }
  ngOnInit() {}
}
