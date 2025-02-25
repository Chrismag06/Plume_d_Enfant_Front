import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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

  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;

  @Input() audioSrc: string = ''; // URL du fichier audio

  constructor(private ttsService: TtsService) {}

  ngOnChanges() {
    if (this.textToSpeak) {
      this.ttsService.getSpeech(this.textToSpeak).subscribe(blob => {
        this.audioUrl = URL.createObjectURL(blob); // Convertir le Blob en URL
      }, error => {
        console.error('Erreur lors de la récupération du son:', error);
      });
    }
  }

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
