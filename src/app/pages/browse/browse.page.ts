import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Genre } from 'src/app/models/Genre';
import { GenreHelper } from 'src/app/models/GenreHelper';
import { Playlist } from 'src/app/models/Playlist';
import { PlaylistGroup } from 'src/app/models/PlaylistGroup';
import { Randomizer } from 'src/app/models/Randomizer';
import { FirestoreService } from 'src/app/services/FirestoreService';
import { GenrePage } from '../genre/genre.page';
import { PlaylistPage } from '../playlist/playlist.page';

@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class BrowsePage implements OnInit {
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

  async goToPlaylist(playlist: Playlist) {
    const modal = await this.modalCtrl.create(PlaylistPage, { playlist: playlist });
    return await modal.present();
  }

  goToGenre(genre: Genre) {
    this.navCtrl.push(GenrePage, { genre: genre });
  }

  ngOnInit() {}
}
