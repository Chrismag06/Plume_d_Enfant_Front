import { Component } from '@angular/core';
import { TtsService } from '../../service/tts.service';

@Component({
  selector: 'app-tts-player',
  imports: [],
  templateUrl: './tts-player.component.html',
  styleUrl: './tts-player.component.css'
})
export class TtsPlayerComponent {
  textToSpeak = 'Bonjour, comment ça va ?';
  audioUrl: string | null = null;

  constructor(private ttsService: TtsService) {}

  generateSpeech() {
    this.ttsService.getSpeech(this.textToSpeak).subscribe(blob => {
      const audioUrl = URL.createObjectURL(blob);
      this.audioUrl = audioUrl;
      this.playAudio();
    });
  }

  playAudio() {
    if (this.audioUrl) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }
}
