import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs';
import { TtsPlayerComponent } from "./components/tts-player/tts-player.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent, TtsPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit {
generateSpeech() {
throw new Error('Method not implemented.');
}
  title = 'plumedEnfant_Front';

  is404: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let currentUrl = this.router.url;

        if (currentUrl == '/404') {
          this.is404 = true;
        }
      });
  }
}
