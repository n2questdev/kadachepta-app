import { Song } from './Song';

export class Playlist {
  constructor() {}

  playlistId: string;
  name: string;
  picture: string;
  songs: Song[];
}
