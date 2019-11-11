import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Events, ModalController, NavController, NavParams } from '@ionic/angular';
import { Album } from 'src/app/models/Album';
import { Artist } from 'src/app/models/Artist';
import { FavoriteItem } from 'src/app/models/FavoriteItem';
import { FavoriteType } from 'src/app/models/FavoriteType';
import { Playlist } from 'src/app/models/Playlist';
import { Song } from 'src/app/models/Song';
import { AudioService } from '../../services/AudioService';
import { AuthService } from '../../services/AuthService';
import { FirestoreService } from '../../services/FirestoreService';
import { AlbumPage } from '../album/album.page';
import { ArtistPage } from '../artist/artist.page';
import { PlaylistPage } from '../playlist/playlist.page';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage implements OnInit {
  userId: string;

  favoriteType: FavoriteType;
  favoriteItems: FavoriteItem[] = [];

  playlists: Playlist[] = [];
  songs: Song[] = [];
  albums: Album[] = [];
  artists: Artist[] = [];

  loaded = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private navParams: NavParams,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private audioService: AudioService,
    private events: Events
  ) {
    this.favoriteType = this.navParams.get('favoriteType');

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
    console.log('ionViewDidLoad FavoritesPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter FavoritesPage');

    this.getFavoriteItems();
    this.updateSongIsPlaying();
  }

  updateSongIsPlaying() {
    if (this.loaded && this.audioService.playingTrack() !== undefined) {
      this.favoriteItems.forEach(favoriteItem => {
        if (favoriteItem.id == this.audioService.playingTrack().songId) {
          favoriteItem.isPlaying = true;
        } else {
          favoriteItem.isPlaying = false;
        }
      });
    }
  }

  getFavoriteItems() {
    this.favoriteItems = [];

    switch (this.favoriteType) {
      case FavoriteType.Playlist:
        this.getFavoritePlaylists();
        break;

      case FavoriteType.Song:
        this.getFavoriteSongs();
        break;

      case FavoriteType.Album:
        this.getFavoriteAlbums();
        break;

      case FavoriteType.Artist:
        this.getFavoriteArtists();
        break;
    }
  }

  getFavoritePlaylists() {
    this.firestoreService
      .getFavoritePlaylists(this.userId)
      .then((result: any) => {
        this.playlists = result.favoritePlaylists as Playlist[];

        this.playlists.forEach(playlist => {
          const favoriteItem = new FavoriteItem();

          favoriteItem.id = playlist.playlistId;
          favoriteItem.name = playlist.name;
          favoriteItem.picture = playlist.picture;

          this.favoriteItems.push(favoriteItem);
        });

        this.loaded = true;
      });
  }

  getFavoriteSongs() {
    this.firestoreService.getFavoriteSongs(this.userId).then((result: any) => {
      this.songs = result.favoriteSongs as Song[];

      this.songs.forEach(song => {
        const favoriteItem = new FavoriteItem();

        favoriteItem.id = song.songId;
        favoriteItem.name = song.name;
        favoriteItem.artistName = song.artistName;
        favoriteItem.picture = song.albumPicture;

        this.favoriteItems.push(favoriteItem);
      });

      this.loaded = true;
      this.updateSongIsPlaying();
    });
  }

  getFavoriteAlbums() {
    this.firestoreService.getFavoriteAlbums(this.userId).then((result: any) => {
      this.albums = result.favoriteAlbums as Album[];

      this.albums.forEach(album => {
        const favoriteItem = new FavoriteItem();

        favoriteItem.id = album.albumId;
        favoriteItem.name = album.name;
        favoriteItem.artistName = album.artistName;
        favoriteItem.picture = album.picture;

        this.favoriteItems.push(favoriteItem);
      });

      this.loaded = true;
    });
  }

  getFavoriteArtists() {
    this.firestoreService
      .getFavoriteArtists(this.userId)
      .then((result: any) => {
        this.artists = result.favoriteArtists as Artist[];

        this.artists.forEach(artist => {
          const favoriteItem = new FavoriteItem();

          favoriteItem.id = artist.artistId;
          favoriteItem.name = artist.name;
          favoriteItem.picture = artist.picture;

          this.favoriteItems.push(favoriteItem);
        });

        this.loaded = true;
      });
  }

  async favoriteActionSheet(favoriteItem: FavoriteItem) {
    let text = '';

    switch (this.favoriteType) {
      case FavoriteType.Playlist:
        text = 'Unfollow playlist';
        break;

      case FavoriteType.Song:
        text = 'Unlike song';
        break;

      case FavoriteType.Album:
        text = 'Unfollow album';
        break;

      case FavoriteType.Artist:
        text = 'Unfollow artist';
        break;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: favoriteItem.name,
      buttons: [
        {
          text: text,
          role: 'unfollow',
          icon: 'md-close-circle',
          handler: () => {
            switch (this.favoriteType) {
              case FavoriteType.Playlist:
                this.unfollowPlaylist(favoriteItem);
                break;

              case FavoriteType.Song:
                this.unlikeSong(favoriteItem);
                break;

              case FavoriteType.Album:
                this.unfollowAlbum(favoriteItem);
                break;

              case FavoriteType.Artist:
                this.unfollowArtist(favoriteItem);
                break;
            }
          }
        }
      ]
    });

    return await actionSheet.present();
  }

  unfollowPlaylist(favoriteItem: FavoriteItem) {
    const playlist = this.playlists.find(
      playlist => playlist.playlistId === favoriteItem.id
    );

    this.firestoreService.unfollowPlaylist(this.userId, playlist).then(() => {
      this.removePlaylistFromList(playlist);
      this.removeFavoriteFromList(favoriteItem);
    });
  }

  unlikeSong(favoriteItem: FavoriteItem) {
    const song = this.songs.find(song => song.songId === favoriteItem.id);

    this.firestoreService.unlikeSong(this.userId, song).then(() => {
      this.removeSongFromList(song);
      this.removeFavoriteFromList(favoriteItem);
    });
  }

  unfollowAlbum(favoriteItem: FavoriteItem) {
    const album = this.albums.find(album => album.albumId === favoriteItem.id);

    this.firestoreService.unfollowAlbum(this.userId, album).then(() => {
      this.removeAlbumFromList(album);
      this.removeFavoriteFromList(favoriteItem);
    });
  }

  unfollowArtist(favoriteItem: FavoriteItem) {
    const artist = this.artists.find(
      artist => artist.artistId === favoriteItem.id
    );

    this.firestoreService.unfollowArtist(this.userId, artist).then(() => {
      this.removeArtistFromList(artist);
      this.removeFavoriteFromList(favoriteItem);
    });
  }

  removePlaylistFromList(playlist: Playlist) {
    const index = this.playlists.indexOf(playlist);
    if (index > -1) {
      this.playlists.splice(index, 1);
    }
  }

  removeSongFromList(song: Song) {
    const index = this.songs.indexOf(song);
    if (index > -1) {
      this.songs.splice(index, 1);
    }
  }

  removeAlbumFromList(album: Album) {
    const index = this.albums.indexOf(album);
    if (index > -1) {
      this.albums.splice(index, 1);
    }
  }

  removeArtistFromList(artist: Artist) {
    const index = this.artists.indexOf(artist);
    if (index > -1) {
      this.artists.splice(index, 1);
    }
  }

  removeFavoriteFromList(favoriteItem: FavoriteItem) {
    const index = this.favoriteItems.indexOf(favoriteItem);
    if (index > -1) {
      this.favoriteItems.splice(index, 1);
    }
  }

  handleFavoriteClick(favoriteItem: FavoriteItem) {
    switch (this.favoriteType) {
      case FavoriteType.Playlist:
        this.goToPlaylist(favoriteItem);
        break;

      case FavoriteType.Song:
        this.playSong(favoriteItem);
        break;

      case FavoriteType.Album:
        this.gotToAlbum(favoriteItem);
        break;

      case FavoriteType.Artist:
        this.goToArtist(favoriteItem);
        break;
    }
  }

  goToPlaylist(favoriteItem: FavoriteItem) {
    const playlist = this.playlists.find(
      playlist => playlist.playlistId === favoriteItem.id
    );

    this.navCtrl.push(PlaylistPage, { playlist: playlist });
  }

  gotToAlbum(favoriteItem: FavoriteItem) {
    const album = this.albums.find(album => album.albumId === favoriteItem.id);
    this.navCtrl.push(AlbumPage, { albumId: album.albumId });
  }

  goToArtist(favoriteItem: FavoriteItem) {
    const artist = this.artists.find(
      artist => artist.artistId === favoriteItem.id
    );

    this.navCtrl.push(ArtistPage, { artistId: artist.artistId });
  }

  playSong(favoriteItem: FavoriteItem) {
    const song = this.songs.find(song => song.songId === favoriteItem.id);

    const track = this.getTrackFromSong(song);
    const tracks = [track];

    if (this.audioService.setTracksAndPlay(tracks, 0)) {
      this.firestoreService.addSongToRecentlyPlayed(this.userId, this.songs[0]);
      this.updateSongIsPlaying();
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

  dismiss() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}
}
