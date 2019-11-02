import { Component } from '@angular/core';
import { NavController, ActionSheetController, Events } from '@ionic/angular';
import { SearchItem } from 'src/data/SearchItem';
import { Song } from 'src/data/Song';
import { Artist } from 'src/data/Artist';
import { Album } from 'src/data/Album';
import { FirestoreService } from 'src/services/FirestoreService';
import { AudioService } from 'src/services/AudioService';
import { AuthService } from 'src/services/AuthService';
import { SearchItemType } from 'src/data/SearchItemType';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  userId: string;

  recentSearches: SearchItem[] = [];
  tracks: any[] = [];

  isSearching = false;
  searchDone = false;
  searchValue = '';

  foundSongs: Song[] = [];
  foundArtists: Artist[] = [];
  foundAlbums: Album[] = [];

  songs: Song[] = [];
  albums: Album[] = [];
  artists: Artist[] = [];

  loaded = false;

  constructor(
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private firestoreService: FirestoreService,
    private audioService: AudioService,
    private authService: AuthService,
    private events: Events
  ) {
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
    console.log('ionViewDidEnter SearchPage');
    this.listenForSearchInput(500);
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad SearchPage');

    this.getRecentSearches();
    this.updateSongIsPlaying();
  }

  updateSongIsPlaying() {
    if (this.loaded && this.audioService.playingTrack() !== undefined) {
      if (this.isSearching) {
        this.foundSongs.forEach(song => {
          if (song.songId === this.audioService.playingTrack().songId) {
            song.isPlaying = true;
          } else {
            song.isPlaying = false;
          }
        });
      } else {
        this.recentSearches.forEach(recentSearch => {
          if (recentSearch.id === this.audioService.playingTrack().songId) {
            recentSearch.isPlaying = true;
          } else {
            recentSearch.isPlaying = false;
          }
        });
      }
    }
  }

  getRecentSearches() {
    this.recentSearches = [];

    this.firestoreService.getRecentSearches(this.userId).then((result: any) => {
      result.recentSearches.forEach(recentSearch => {
        const searchItem = new SearchItem();

        if (recentSearch instanceof Song) {
          const recentSong = recentSearch as Song;
          this.songs.push(recentSong);

          searchItem.id = recentSong.songId;
          searchItem.name = recentSong.name;
          searchItem.description = 'Song';
          searchItem.picture = recentSong.albumPicture;
          searchItem.searchItemType = SearchItemType.Song;
        } else if (recentSearch instanceof Artist) {
          const recentArtist = recentSearch as Artist;
          this.artists.push(recentArtist);

          searchItem.id = recentArtist.artistId;
          searchItem.name = recentArtist.name;
          searchItem.description = 'Artist';
          searchItem.picture = recentArtist.picture;
          searchItem.searchItemType = SearchItemType.Artist;
        } else if (recentSearch instanceof Album) {
          const recentAlbum = recentSearch as Album;
          this.albums.push(recentAlbum);

          searchItem.id = recentAlbum.albumId;
          searchItem.name = recentAlbum.name;
          searchItem.description = 'Album';
          searchItem.picture = recentAlbum.picture;
          searchItem.searchItemType = SearchItemType.Album;
        }

        this.recentSearches.push(searchItem);
      });

      this.loaded = true;
      this.updateSongIsPlaying();
    });
  }

  listenForSearchInput(timeoutTime: number): any {
    const searchInput = <HTMLInputElement>(
      document.getElementById('searchInput')
    );

    let timeout = null;

    searchInput.onkeyup = e => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        this.search(this.searchValue);
      }, timeoutTime);
    };
  }

  search(searchValue: string) {
    this.isSearching = true;

    this.searchSongs(searchValue);
    this.searchArtists(searchValue);
    this.searchAlbums(searchValue);
  }

  searchSongs(searchValue: string) {
    if (searchValue !== '' && searchValue.length >= 3) {
      this.foundSongs = [];

      this.firestoreService.getSongs().then((result: any) => {
        (result.songs as Song[]).forEach(song => {
          if (
            song.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
            song.artistName.toLowerCase().indexOf(searchValue.toLowerCase()) >
            -1 ||
            song.albumName.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          ) {
            this.foundSongs.push(song);
          }
        });

        this.foundSongs.forEach(song => {
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

        this.updateSongIsPlaying();
      });
    } else if (searchValue === '') {
      this.clearSearch();
    }
  }

  searchArtists(searchValue: string) {
    if (searchValue !== '' && searchValue.length >= 3) {
      this.foundArtists = [];

      this.firestoreService.getArtists().then((result: any) => {
        (result.artists as Artist[]).forEach(artist => {
          if (
            artist.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          ) {
            this.foundArtists.push(artist);
          }
        });
      });
    } else if (searchValue === '') {
      this.clearSearch();
    }
  }

  searchAlbums(searchValue: string) {
    if (searchValue !== '' && searchValue.length >= 3) {
      this.foundAlbums = [];

      this.firestoreService.getAlbums().then((result: any) => {
        (result.albums as Album[]).forEach(album => {
          if (
            album.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
            album.artistName.toLowerCase().indexOf(searchValue.toLowerCase()) >
            -1
          ) {
            this.foundAlbums.push(album);
          }
        });

        this.searchDone = true;
      });
    } else if (searchValue === '') {
      this.clearSearch();
    }
  }

  onClear(event) {
    this.clearSearch();
  }

  clearSearch() {
    this.isSearching = false;
    this.searchDone = false;
    this.foundSongs = [];
    this.foundArtists = [];
    this.foundAlbums = [];
    this.tracks = [];
  }

  removeFromRecentSearches(searchItem: SearchItem) {
    this.firestoreService
      .clearRecentSearch(this.userId, searchItem)
      .then(() => {
        const index = this.recentSearches.indexOf(searchItem);

        if (index > -1) {
          this.recentSearches.splice(index, 1);
        }
      });
  }

  clearRecentSearches() {
    this.firestoreService.clearAllRecentSearches(this.userId).then(() => {
      this.recentSearches = [];
    });
  }

  playSong(song: Song, trackIndex: number) {
    if (this.audioService.setTracksAndPlay(this.tracks, trackIndex)) {
      this.firestoreService.addSongToRecentSearches(this.userId, song);
      this.firestoreService.addSongToRecentlyPlayed(this.userId, song);
      this.updateSongIsPlaying();
    }
  }

  selectArtist(artist: Artist) {
    this.firestoreService
      .addArtistToRecentSearches(this.userId, artist)
      .then(() => {
        this.goToArtist(artist.artistId);
      });
  }

  selectAlbum(album: Album) {
    this.firestoreService
      .addAlbumToRecentSearches(this.userId, album)
      .then(() => {
        this.gotToAlbum(album.albumId);
      });
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
            this.gotToAlbum(song.albumId);
          }
        },
        {
          text: 'View Artist',
          role: 'viewArtist',
          icon: 'md-person',
          handler: () => {
            this.goToArtist(song.artistId);
          }
        }
      ]
    });

    actionSheet.present();
  }

  albumActionSheet(album: Album) {
    const actionSheet = this.actionSheetCtrl.create({
      title: album.name,
      buttons: [
        {
          text: 'View Artist',
          role: 'viewArtist',
          icon: 'md-person',
          handler: () => {
            this.goToArtist(album.artistId);
          }
        }
      ]
    });

    actionSheet.present();
  }

  gotToAlbum(albumId: string) {
    this.navCtrl.push(AlbumPage, { albumId: albumId });
  }

  goToArtist(artistId: string) {
    this.navCtrl.push(ArtistPage, { artistId: artistId });
  }

  handleSearchItemClick(searchItem: SearchItem) {
    console.log(searchItem);

    switch (searchItem.searchItemType) {
      case SearchItemType.Song: {
        const song = this.songs.find(song => song.songId === searchItem.id);
        const track = this.getTrackFromSong(song);
        this.tracks = [track];

        this.playSong(song, 0);
        break;
      }

      case SearchItemType.Album:
        this.gotToAlbum(searchItem.id);
        break;

      case SearchItemType.Artist:
        this.goToArtist(searchItem.id);
        break;
    }
  }

  getTrackFromSong(song: Song): any {
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

    return track;
  }
}
