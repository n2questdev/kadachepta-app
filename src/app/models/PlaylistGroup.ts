import { Playlist } from './Playlist';

export class PlaylistGroup {
  constructor() {}

  playlistGroupId: string;
  name: string;
  playlists: Playlist[] = [];
}
