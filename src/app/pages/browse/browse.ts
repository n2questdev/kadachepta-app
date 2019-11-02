import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PlaylistGroup } from 'src/data/PlaylistGroup';
import { Genre } from 'src/data/Genre';
import { FirestoreService } from 'src/services/FirestoreService';
import { Randomizer } from 'src/data/Randomizer';
import { GenreHelper } from 'src/data/GenreHelper';
import { Playlist } from 'src/data/Playlist';
import { PlaylistPage } from '../playlist/playlist';


@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class BrowsePage {
  playlistGroup: PlaylistGroup = new PlaylistGroup();
  genres: Genre[] = [];

  loadedGenres = false;

  constructor(
    public navCtrl: NavController,
    private firestoreService: FirestoreService,
    private modalCtrl: ModalController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowsePage');
    this.getPlaylistGroups();
    this.getGenres();
  }

  getPlaylistGroups(): void {
    this.firestoreService.getPlaylistGroups().then((result: any) => {
      const playlistGroups = result.playlistGroups as PlaylistGroup[];

      const randomIndex = Randomizer.randomIntFromInterval(
        0,
        playlistGroups.length - 1
      );

      this.playlistGroup = playlistGroups[randomIndex];

      this.firestoreService
        .getPlaylistGroupPlaylists(this.playlistGroup)
        .then((result: any) => {
          this.playlistGroup.playlists = result.playlistGroupPlaylists;
        });
    });
  }

  getGenres() {
    this.firestoreService.getGenres().then((result: any) => {
      this.genres = result.genres;

      this.genres.forEach(genre => {
        const existingGenre = GenreHelper.genres.find(
          x => x.name === genre.name
        );

        if (existingGenre) {
          genre.picture = existingGenre.picture;
        }
      });

      this.loadedGenres = true;
    });
  }

  goToPlaylist(playlist: Playlist) {
    const modal = this.modalCtrl.create(PlaylistPage, { playlist: playlist });
    modal.present();
  }

  goToGenre(genre: Genre) {
    this.navCtrl.push(GenrePage, { genre: genre });
  }
}
