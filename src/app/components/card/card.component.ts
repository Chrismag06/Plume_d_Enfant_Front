import { Component, Input, OnInit } from '@angular/core';
import { Histoire } from '../../model/histoire';
import { CategorieHistoire } from '../../model/categorie-histoire';
import { CategorieAge } from '../../model/categorie-age';
import { Utilisateur } from '../../model/utilisateur';
import { CatHistoireComponent } from '../cat-histoire/cat-histoire.component';
import { CatAgeComponent } from '../cat-age/cat-age.component';
import { AuthService } from '../../service/auth.service';
import { UtilisateurService } from '../../service/utilisateur.service';
import { Subscription } from 'rxjs';
import { TtsPlayerComponent } from "../tts-player/tts-player.component";

@Component({
  selector: 'app-card',
  imports: [CatHistoireComponent, CatAgeComponent, TtsPlayerComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  standalone: true,
})
export class CardComponent implements OnInit {
  createur: Utilisateur = new Utilisateur(
    1,
    'mail@mail.com',
    'truc',
    [],
    [],
    []
  );

  private authSubscription: Subscription | null = null;
  isLoggedIn: boolean = false;
  listVues: Array<Histoire> | null = [];
  listFavori: Array<Histoire> | null = [];

  isVue: boolean = false;
  isFavori: boolean = false;

  @Input()
  histoire: Histoire = new Histoire(
    1,
    'Le baton du ciel',
    'IL était une fois, un baton',
    CategorieHistoire.Fantastique,
    CategorieAge.HuitNeufAns,
    '',
    1,
    this.createur
  );

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthObservable.subscribe(
      (authStatut) => {
        this.isLoggedIn = authStatut;
        if (this.isLoggedIn) {
          this.utilisateurService
            .getUtilisateurById(this.authService.getUserId())
            .subscribe((utilisateur) => {
              this.listVues = utilisateur.listeVue;
              if (
                this.listVues?.some(
                  (histoire) => histoire.id === this.histoire.id
                )
              ) {
                this.isVue = true;
              }

              this.listFavori = utilisateur.listeFavori;
              if (
                this.listFavori?.some(
                  (histoire) => histoire.id === this.histoire.id
                )
              ) {
                this.isFavori = true;
              }
            });
        }
      }
    );
  }
}
