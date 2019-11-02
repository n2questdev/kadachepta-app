import { Injectable } from '@angular/core';
import { AudioProvider } from '../components/ionic-audio';
import { MusicControls } from '@ionic-native/music-controls';
import { Platform, ToastController, Events } from '@ionic/angular';

@Injectable()
export class AudioService {
  trackIndex: number;

  isRepeat: number;
  isShuffle: boolean;

  constructor(
    private platform: Platform,
    public audioProvider: AudioProvider,
    private musicControls: MusicControls,
    private toastCtrl: ToastController,
    private events: Events
  ) {
    this.trackIndex = 0;
    this.isShuffle = false;
    this.isRepeat = 0;
  }

  progress() {
    return this.audioProvider.progress();
  }

  playingTrack() {
    return this.audioProvider.playingTrack();
  }

  setTracksAndPlay(tracks: any[], trackIndex: number): boolean {
    if (!this.audioProvider.canPlay()) {
      return false;
    }

    this.audioProvider.resetTracks();

    this.trackIndex = trackIndex;

    tracks.forEach(track => {
      this.audioProvider.create(track);
    });

    this.audioProvider.play(this.trackIndex, () => {
      this.next();
    });

    if (this.platform.is('cordova')) {
      this.initialiseMusicControls(tracks[this.trackIndex]);
    }

    return true;
  }

  play() {
    this.audioProvider.play(this.trackIndex, () => {
      this.next();
    });

    this.musicControls.updateIsPlaying(true);
  }

  pause() {
    this.audioProvider.pause();
    this.musicControls.updateIsPlaying(false);
  }

  next() {
    if (this.audioProvider.current != undefined) {
      if (this.isShuffle) {
        // loop until find appropriate random index
        while (true) {
          const randomIndex = Math.floor(
            Math.random() * this.audioProvider.tracks.length
          );

          if (randomIndex !== this.audioProvider.current) {
            this.trackIndex = randomIndex;
            this.playNextOrPrevious();
            break;
          }
        }
      } else {
        if (this.audioProvider.current < this.audioProvider.tracks.length - 1) {
          this.trackIndex = this.audioProvider.current + 1;
        } else {
          this.trackIndex = 0;
        }

        this.playNextOrPrevious();
      }
    }
  }

  previous() {
    if (this.audioProvider.current !== undefined) {
      if (this.isShuffle) {
        // loop until find appropriate random index
        while (true) {
          const randomIndex = Math.floor(
            Math.random() * this.audioProvider.tracks.length + 0
          );

          if (randomIndex !== this.audioProvider.current) {
            this.trackIndex = randomIndex;
            this.playNextOrPrevious();
            break;
          }
        }
      } else {
        if (this.audioProvider.current > 0) {
          this.trackIndex = this.audioProvider.current - 1;
        } else {
          this.trackIndex = this.audioProvider.tracks.length - 1;
        }

        this.playNextOrPrevious();
      }
    }
  }

  playNextOrPrevious() {
    if (this.audioProvider.current !== undefined) {
      this.audioProvider.pause();
      this.audioProvider.seekTo(0);
    }

    this.audioProvider.play(this.trackIndex, () => {
      this.next();
    });

    if (this.platform.is('cordova')) {
      this.initialiseMusicControls(this.audioProvider.tracks[this.trackIndex]);
      this.musicControls.updateIsPlaying(true);
    }
  }

  shuffle() {
    this.isShuffle = !this.isShuffle;

    const toast = this.toastCtrl.create({
      message: 'Shuffle ' + (this.isShuffle ? 'ON' : 'OFF'),
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  repeat() {
    let repeatState = '';

    switch (this.isRepeat) {
      case 0:
        this.isRepeat = 1;
        repeatState = 'ON';
        break;

      case 1:
        this.isRepeat = 2;
        repeatState = 'ONCE';
        break;

      case 2:
        this.isRepeat = 0;
        repeatState = 'OFF';
        break;
    }

    const toast = this.toastCtrl.create({
      message: 'Repeat ' + repeatState,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  seekTo() {
    const seek = this.audioProvider.tracks[0].progress + 5;
    this.audioProvider.seekTo(seek);
  }

  seekBack() {
    const seek = this.audioProvider.tracks[0].progress - 5;
    this.audioProvider.seekTo(seek);
  }

  stop() {
    if (this.audioProvider.current !== undefined) {
      this.audioProvider.seekTo(0);
      this.audioProvider.pause();
      this.musicControls.updateIsPlaying(false);
    }
  }

  initialiseMusicControls(track) {
    this.musicControls.create({
      track: track.title, // optional, default : ''
      artist: track.artist, // optional, default : ''
      cover: track.art, // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true, // optional, default : true
      dismissable: true, // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: true, // show previous button, optional, default: true
      hasNext: true, // show next button, optional, default: true
      hasClose: false, // show close button, optional, default: false

      // iOS only, optional
      album: track.albumName, // optional, default: ''
      duration: this.audioProvider.tracks[this.audioProvider.current].duration, // optional, default: 0
      elapsed: this.audioProvider.tracks[this.audioProvider.current].progress, // optional, default: 0
      hasSkipForward: true, // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker: 'Now playing ' + track.name,

      // All icons default to their built-in android equivalents
      // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;

      switch (message) {
        case 'music-controls-next':
          this.next();
          this.events.publish('updateSongIsPlaying');
          break;

        case 'music-controls-previous':
          this.previous();
          this.events.publish('updateSongIsPlaying');
          break;

        case 'music-controls-pause':
          this.pause();
          break;

        case 'music-controls-play':
          this.play();
          break;

        case 'music-controls-destroy':
          this.musicControls.destroy();
          this.stop();
          break;

        // External controls (iOS only)
        case 'music-controls-toggle-play-pause':
          // Do something
          break;

        case 'music-controls-seek-to':
          const seekToInSeconds = JSON.parse(action).position;

          this.musicControls.updateElapsed({
            elapsed: seekToInSeconds,
            isPlaying: true
          });
          break;

        case 'music-controls-skip-forward':
          this.seekTo();
          break;

        case 'music-controls-skip-backward':
          this.seekBack();
          break;

        // Headset events (Android only)
        // All media button events are listed below
        case 'music-controls-media-button':
          // Do something
          break;

        case 'music-controls-headset-unplugged':
          this.pause();
          break;

        case 'music-controls-headset-plugged':
          // Do something
          break;

        default:
          break;
      }
    });

    this.musicControls.listen(); // activates the observable above
  }
}
