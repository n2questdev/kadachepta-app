import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { SearchItemType } from '../models/SearchItemType';
import { Song } from '../models/Song';
import { Album } from '../models/Album';
import { Artist } from '../models/Artist';
import { Playlist } from '../models/Playlist';
import { PlaylistGroup } from '../models/PlaylistGroup';
import { Genre } from '../models/Genre';
import { SearchItem } from '../models/SearchItem';

@Injectable()
export class FirestoreService {
  constructor() { }

  addUser(user: firebase.User) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(user.uid)
        .set(
          {
            name: user.displayName
          },
          { merge: true }
        )
        .then(function () {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getRecentSearches(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      // only get the latest 10 recent searches
      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .orderBy('addedAt', 'desc')
        .limit(10)
        .get()
        .then(recentSearchesSnapshot => {
          const recentSearches = [];

          recentSearchesSnapshot.forEach(doc => {
            const itemType = doc.data().itemType;

            if (itemType === SearchItemType.Song) {
              const song = new Song();

              song.songId = doc.id;
              song.name = doc.data().name;
              song.artistId = doc.data().artistId;
              song.artistName = doc.data().artistName;
              song.albumId = doc.data().albumId;
              song.albumName = doc.data().albumName;
              song.albumPicture = doc.data().albumPicture;
              song.songUrl = doc.data().songUrl;

              recentSearches.push(song);
            } else if (itemType === SearchItemType.Artist) {
              const artist = new Artist();

              artist.artistId = doc.id;
              artist.name = doc.data().name;
              artist.picture = doc.data().picture;

              recentSearches.push(artist);
            } else if (itemType === SearchItemType.Album) {
              const album = new Album();

              album.albumId = doc.id;
              album.name = doc.data().name;
              album.picture = doc.data().picture;
              album.artistId = doc.data().artistId;
              album.artistName = doc.data().artistName;

              recentSearches.push(album);
            }
          });

          resolve({ recentSearches: recentSearches });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  addSongToRecentSearches(userId: string, song: Song) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .doc(song.songId)
        .set({
          itemType: SearchItemType.Song,
          name: song.name,
          artistId: song.artistId,
          artistName: song.artistName,
          albumId: song.albumId,
          albumName: song.albumName,
          albumPicture: song.albumPicture,
          songUrl: song.songUrl,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  addArtistToRecentSearches(userId: string, artist: Artist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .doc(artist.artistId)
        .set({
          itemType: SearchItemType.Artist,
          name: artist.name,
          picture: artist.picture,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  addAlbumToRecentSearches(userId: string, album: Album) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .doc(album.albumId)
        .set({
          itemType: SearchItemType.Album,
          name: album.name,
          picture: album.picture,
          artistId: album.artistId,
          artistName: album.artistName,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  clearRecentSearch(userId: string, searchItem: SearchItem) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .doc(searchItem.id)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  clearAllRecentSearches(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentSearches')
        .get()
        .then(recentSearchesSnapshot => {
          recentSearchesSnapshot.forEach(doc => {
            db.collection('users')
              .doc(userId)
              .collection('recentSearches')
              .doc(doc.id)
              .delete();
          });

          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getRecentlyPlayed(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      // only get the latest 10 recent searches
      db.collection('users')
        .doc(userId)
        .collection('recentlyPlayed')
        .orderBy('addedAt', 'desc')
        .limit(10)
        .get()
        .then(recentlyPlayedSnapshot => {
          const recentlyPlayed = [];

          recentlyPlayedSnapshot.forEach(doc => {
            const song = new Song();

            song.songId = doc.id;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            recentlyPlayed.push(song);
          });

          resolve({ recentlyPlayed: recentlyPlayed });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  addSongToRecentlyPlayed(userId: string, song: Song) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('recentlyPlayed')
        .doc(song.songId)
        .set({
          name: song.name,
          artistId: song.artistId,
          artistName: song.artistName,
          albumId: song.albumId,
          albumName: song.albumName,
          albumPicture: song.albumPicture,
          songUrl: song.songUrl,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
          resolve();
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });

    return promise;
  }

  getPlaylists() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('playlists')
        .get()
        .then(playlistsSnapshot => {
          const playlists = [];

          playlistsSnapshot.forEach(doc => {
            const playlist = new Playlist();

            playlist.playlistId = doc.id;
            playlist.name = doc.data().name;
            playlist.picture = doc.data().picture;

            playlists.push(playlist);
          });

          resolve({ playlists: playlists });
        });
    });

    return promise;
  }

  getPlaylistSongs(playlist: Playlist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('playlists')
        .doc(playlist.playlistId)
        .collection('songs')
        .get()
        .then(playlistSongsSnapshot => {
          const playlistSongs = [];

          playlistSongsSnapshot.forEach(doc => {
            const song = new Song();

            song.playlistSongId = doc.id;
            song.songId = doc.data().songId;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            playlistSongs.push(song);
          });

          resolve({ playlistSongs: playlistSongs });
        });
    });

    return promise;
  }

  getAlbum(albumId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('albums')
        .doc(albumId)
        .get()
        .then(doc => {
          const album = new Album();

          album.albumId = doc.id;
          album.name = doc.data().name;
          album.picture = doc.data().picture;
          album.artistId = doc.data().artistId;
          album.artistName = doc.data().artistName;

          resolve({ album: album });
        });
    });

    return promise;
  }

  getAlbumSongs(albumId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('songs')
        .where('albumId', '==', albumId)
        .get()
        .then(songsSnapshot => {
          const songs = [];

          songsSnapshot.forEach(doc => {
            const song = new Song();

            song.songId = doc.id;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            songs.push(song);
          });

          resolve({ songs: songs });
        });
    });

    return promise;
  }

  getArtist(artistId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('artists')
        .doc(artistId)
        .get()
        .then(doc => {
          const artist = new Artist();

          artist.artistId = doc.id;
          artist.name = doc.data().name;
          artist.picture = doc.data().picture;

          resolve({ artist: artist });
        });
    });

    return promise;
  }

  getArtistAlbums(artistId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('albums')
        .where('artistId', '==', artistId)
        .get()
        .then(albumsSnapshot => {
          const albums = [];

          albumsSnapshot.forEach(doc => {
            const album = new Album();

            album.albumId = doc.id;
            album.name = doc.data().name;
            album.picture = doc.data().picture;
            album.artistId = doc.data().artistId;
            album.artistName = doc.data().artistName;

            albums.push(album);
          });

          resolve({ albums: albums });
        });
    });

    return promise;
  }

  getSongs() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('songs')
        .get()
        .then(songsSnapshot => {
          const songs = [];

          songsSnapshot.forEach(doc => {
            const song = new Song();

            song.songId = doc.id;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            songs.push(song);
          });

          resolve({ songs: songs });
        });
    });

    return promise;
  }

  getArtists() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('artists')
        .get()
        .then(artistsSnapshot => {
          const artists = [];

          artistsSnapshot.forEach(doc => {
            const artist = new Artist();

            artist.artistId = doc.id;
            artist.name = doc.data().name;
            artist.picture = doc.data().picture;

            artists.push(artist);
          });

          resolve({ artists: artists });
        });
    });

    return promise;
  }

  getAlbums() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('albums')
        .get()
        .then(albumsSnapshot => {
          const albums = [];

          albumsSnapshot.forEach(doc => {
            const album = new Album();

            album.albumId = doc.id;
            album.name = doc.data().name;
            album.picture = doc.data().picture;
            album.artistId = doc.data().artistId;
            album.artistName = doc.data().artistName;

            albums.push(album);
          });

          resolve({ albums: albums });
        });
    });

    return promise;
  }

  getIsFollowingPlaylist(userId: string, playlist: Playlist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('playlistsFollowed')
        .get()
        .then(playlistsFollowedSnapshot => {
          playlistsFollowedSnapshot.forEach(doc => {
            if (doc.id === playlist.playlistId) {
              resolve({ isFollowing: true });
            }
          });

          resolve({ isFollowing: false });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getIsFollowingAlbum(userId: string, album: Album) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('albumsFollowed')
        .get()
        .then(albumsFollowedSnapshot => {
          albumsFollowedSnapshot.forEach(doc => {
            if (doc.id === album.albumId) {
              resolve({ isFollowing: true });
            }
          });

          resolve({ isFollowing: false });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getIsFollowingArtist(userId: string, artist: Artist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('artistsFollowed')
        .get()
        .then(artistsFollowedSnapshot => {
          artistsFollowedSnapshot.forEach(doc => {
            if (doc.id === artist.artistId) {
              resolve({ isFollowing: true });
            }
          });

          resolve({ isFollowing: false });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getSongLikeStatus(userId: string, song: Song) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('songsFollowed')
        .get()
        .then(songsFollowedSnapshot => {
          songsFollowedSnapshot.forEach(doc => {
            if (doc.id === song.songId) {
              resolve({ isLiked: true });
            }
          });

          resolve({ isLiked: false });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  followPlaylist(userId: string, playlist: Playlist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('playlistsFollowed')
        .doc(playlist.playlistId)
        .set(
          {
            name: playlist.name,
            picture: playlist.picture
          },
          { merge: true }
        )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  unfollowPlaylist(userId: string, playlist: Playlist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('playlistsFollowed')
        .doc(playlist.playlistId)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getFavoritePlaylists(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('playlistsFollowed')
        .get()
        .then(playlistsFollowedSnapshot => {
          const favoritePlaylists = [];

          playlistsFollowedSnapshot.forEach(doc => {
            const playlist = new Playlist();

            playlist.playlistId = doc.id;
            playlist.name = doc.data().name;
            playlist.picture = doc.data().picture;

            favoritePlaylists.push(playlist);
          });

          resolve({ favoritePlaylists: favoritePlaylists });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  getFavoriteSongs(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('songsFollowed')
        .get()
        .then(songsFollowedSnapshot => {
          const favoriteSongs = [];

          songsFollowedSnapshot.forEach(doc => {
            const song = new Song();

            song.songId = doc.id;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            favoriteSongs.push(song);
          });

          resolve({ favoriteSongs: favoriteSongs });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getFavoriteAlbums(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('albumsFollowed')
        .get()
        .then(albumsFollowedSnapshot => {
          const favoriteAlbums = [];

          albumsFollowedSnapshot.forEach(doc => {
            const album = new Album();

            album.albumId = doc.id;
            album.name = doc.data().name;
            album.picture = doc.data().picture;
            album.artistId = doc.data().artistId;
            album.artistName = doc.data().artistName;

            favoriteAlbums.push(album);
          });

          resolve({ favoriteAlbums: favoriteAlbums });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getFavoriteArtists(userId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('artistsFollowed')
        .get()
        .then(artistsFollowedSnapshot => {
          const favoriteArtists = [];

          artistsFollowedSnapshot.forEach(doc => {
            const artist = new Artist();

            artist.artistId = doc.id;
            artist.name = doc.data().name;
            artist.picture = doc.data().picture;

            favoriteArtists.push(artist);
          });

          resolve({ favoriteArtists: favoriteArtists });
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  likeSong(userId: string, song: Song) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('songsFollowed')
        .doc(song.songId)
        .set(
          {
            name: song.name,
            artistId: song.artistId,
            artistName: song.artistName,
            albumId: song.albumId,
            albumName: song.albumName,
            albumPicture: song.albumPicture,
            songUrl: song.songUrl
          },
          { merge: true }
        )
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  unlikeSong(userId: string, song: Song) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('songsFollowed')
        .doc(song.songId)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  followAlbum(userId: string, album: Album) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('albumsFollowed')
        .doc(album.albumId)
        .set(
          {
            name: album.name,
            picture: album.picture,
            artistId: album.artistId,
            artistName: album.artistName
          },
          { merge: true }
        )
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  unfollowAlbum(userId: string, album: Album) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('albumsFollowed')
        .doc(album.albumId)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  followArtist(userId: string, artist: Artist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('artistsFollowed')
        .doc(artist.artistId)
        .set(
          {
            name: artist.name,
            picture: artist.picture
          },
          { merge: true }
        )
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  unfollowArtist(userId: string, artist: Artist) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('users')
        .doc(userId)
        .collection('artistsFollowed')
        .doc(artist.artistId)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
    });

    return promise;
  }

  getSong(songId: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('songs')
        .doc(songId)
        .get()
        .then(doc => {
          const song = new Song();

          song.songId = doc.id;
          song.name = doc.data().name;
          song.artistId = doc.data().artistId;
          song.artistName = doc.data().artistName;
          song.albumId = doc.data().albumId;
          song.albumName = doc.data().albumName;
          song.albumPicture = doc.data().albumPicture;
          song.songUrl = doc.data().songUrl;

          resolve({ song: song });
        });
    });

    return promise;
  }

  getPlaylistGroups() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('playlistGroups')
        .orderBy('addedAt', 'asc')
        .get()
        .then(playlistGroupsSnapshot => {
          const playlistGroups = [];

          playlistGroupsSnapshot.forEach(doc => {
            const playlistGroup = new PlaylistGroup();

            playlistGroup.playlistGroupId = doc.id;
            playlistGroup.name = doc.data().name;

            playlistGroups.push(playlistGroup);
          });

          resolve({ playlistGroups: playlistGroups });
        });
    });

    return promise;
  }

  getPlaylistGroupPlaylists(playlistGroup: PlaylistGroup) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('playlistGroups')
        .doc(playlistGroup.playlistGroupId)
        .collection('playlists')
        .orderBy('addedAt', 'asc')
        .get()
        .then(playlistGroupPlaylistsSnapshot => {
          const playlistGroupPlaylists = [];

          playlistGroupPlaylistsSnapshot.forEach(doc => {
            const playlist = new Playlist();

            playlist.playlistId = doc.data().playlistId;
            playlist.name = doc.data().name;
            playlist.picture = doc.data().picture;

            playlistGroupPlaylists.push(playlist);
          });

          resolve({ playlistGroupPlaylists: playlistGroupPlaylists });
        });
    });

    return promise;
  }

  getGenres() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('genres')
        .get()
        .then(genresSnapshot => {
          const genres = [];

          genresSnapshot.forEach(doc => {
            const genre = new Genre(doc.data().name);
            genre.genreId = doc.id;

            genres.push(genre);
          });

          resolve({ genres: genres });
        });
    });

    return promise;
  }

  getGenreSongs(genre: Genre) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection('genres')
        .doc(genre.genreId)
        .collection('songs')
        .get()
        .then(genreSongsSnapshot => {
          const genreSongs = [];

          genreSongsSnapshot.forEach(doc => {
            const song = new Song();

            song.genreSongId = doc.id;
            song.songId = doc.data().songId;
            song.name = doc.data().name;
            song.artistId = doc.data().artistId;
            song.artistName = doc.data().artistName;
            song.albumId = doc.data().albumId;
            song.albumName = doc.data().albumName;
            song.albumPicture = doc.data().albumPicture;
            song.songUrl = doc.data().songUrl;

            genreSongs.push(song);
          });

          resolve({ genreSongs: genreSongs });
        });
    });

    return promise;
  }
}
