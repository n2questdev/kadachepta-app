import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MusicPlayerPage } from '../../pages/music-player/music-player';
import { AudioService } from '../../services/AudioService';

@Component({
  selector: 'footer-player',
  templateUrl: 'components-footer-player.html'
})
export class ComponentsFooterPlayerComponent {
  @Input() playingTrack: any;
  @Output() onShowMusicPlayer = new EventEmitter();

  constructor(
    private navCtrl: NavController,
    private audioService: AudioService // Incorrect warning, do not remove this!!
  ) {}

  ngOnInit() {
    console.log('ngOnInit ComponentsFooterPlayerComponent');
  }

  showMusicPlayer() {
    this.navCtrl.push(MusicPlayerPage);
  }
}
