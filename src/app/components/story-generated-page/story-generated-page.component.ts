import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Histoire } from '../../model/histoire';
import { CategorieHistoire } from '../../model/categorie-histoire';
import { CategorieAge } from '../../model/categorie-age';
import { HistoireService } from '../../service/histoire.service';
import { Utilisateur } from '../../model/utilisateur';
import { ActivatedRoute } from '@angular/router';
import { CatAgeComponent } from '../cat-age/cat-age.component';
import { CatHistoireComponent } from '../cat-histoire/cat-histoire.component';
import { AuthService } from '../../service/auth.service';
import { UtilisateurService } from '../../service/utilisateur.service';
import { TtsPlayerComponent } from "../tts-player/tts-player.component";

@Component({
  selector: 'app-story-generated-page',
  imports: [CatAgeComponent, CatHistoireComponent, TtsPlayerComponent],
  templateUrl: './story-generated-page.component.html',
  styleUrl: './story-generated-page.component.css',
  standalone: true,
})
export class StoryGeneratedPageComponent implements OnInit {
  utilisateur: Utilisateur = new Utilisateur(1, '', '', [], [], []);
  histoire: Histoire = new Histoire(
    1,
    '',
    '',
    CategorieHistoire.Fantastique,
    CategorieAge.DeuxTroisAns,
    '',
    0,
    this.utilisateur
  );

  listLike: Array<Histoire> | null = [];
  newListLike: Array<Histoire> | null = [];
  listVues: Array<Histoire> | null = [];
  listFavori: Array<Histoire> | null = [];
  newListFavori: Array<Histoire> | null = [];

  isUserLogin: boolean = false;
  idHistoire: number | null = 0;
  isLiked: boolean = false;
  isFavori: boolean = false;

  promesseGetHistoire!: Promise<string>;

  constructor(
    private histoireService: HistoireService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private utilisateurService: UtilisateurService
  ) {
    this.isUserLogin = this.authService.isAuthenticated();
  }

  @ViewChild('storyText') storyParagraph!: ElementRef;  

  textToRead: string = '';  

  ngOnInit(): void {
    this.idHistoire = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

    this.promesseGetHistoire = new Promise((resolve, reject) => {
      try {
        this.getHistoire();
        resolve("L'histoire est bien récupérée");
      } catch (error) {
        reject("L'histoire n'est pas récupérée");
      }
    });
  }

  ngAfterViewInit() {
    this.textToRead = this.storyParagraph.nativeElement.innerText.trim(); // Récupère le texte du <p>
    // this.cdRef.detectChanges();
  }

  getHistoire(): void {
    if (this.idHistoire) {
      this.histoireService
        .getHistoireById(this.idHistoire)
        .subscribe((histoire) => {
          this.histoire = histoire;

          if (this.histoire.nbLike != null) {
          }
          // Si l'utilisateur est connecté, le bouton like apparait coché ou non en fonction de si l'histoire a déjà été likée
          if (this.isUserLogin) {
            this.utilisateurService
              .getUtilisateurById(this.authService.getUserId())
              .subscribe((utilisateur) => {
                this.listLike = utilisateur.listeLike;
                this.listFavori = utilisateur.listeFavori;

                // Remplissage du bouton like en fct de si l'histoire a déjà été likée par l'utilisateur ou non
                if (
                  this.listLike != null &&
                  this.listLike.find(
                    (histoire) => histoire.id === this.histoire.id
                  )
                ) {
                  this.isLiked = true;
                } else {
                  this.isLiked = false;
                }

                // Ajout de l'histoire à la liste des histoires vues si elle n'y est pas encore
                if (
                  !utilisateur.listeVue?.find(
                    (histoire) => histoire.id === this.histoire.id
                  )
                ) {
                  this.listVues = utilisateur.listeVue;

                  if (this.listVues != null) {
                    this.listVues.push(histoire);
                  }

                  console.log(this.listVues);

                  this.utilisateurService
                    .updateUtilisateur(
                      new Utilisateur(
                        this.authService.getUserId(),
                        null,
                        null,
                        null,
                        null,
                        this.listVues
                      ),
                      this.authService.getUserId()
                    )
                    .subscribe();
                }

                // Verification si l'histoire est en favori
                if (
                  this.listFavori?.some(
                    (histoire) => histoire.id === this.idHistoire
                  )
                ) {
                  this.isFavori = true;
                }
              });
          }
        });
    }
  }

  getBackGround() {
    return `background-image: url(${this.histoire.urlImage});`;
  }

  // Lors du clique sur le bouton like
  changeLike() {
    this.isLiked = !this.isLiked;

    if (this.isLiked) {
      // Si le boutin like est coché, il faut ajouter l'histoire dans la liste de like de l'utilisateur
      if (this.listLike != null) {
        this.listLike.push(this.histoire);
      }
    } else {
      // Si le bouton est décoché, il faut retirer l'histoire de la liste des histoires likées de l'utilisateur
      if (this.listLike != null) {
        this.newListLike = this.listLike.filter(
          (histoireLike) => histoireLike.id !== this.histoire.id
        );
        this.listLike = this.newListLike;
      }
    }

    this.utilisateurService
      .updateUtilisateur(
        new Utilisateur(
          this.authService.getUserId(),
          null,
          null,
          this.listLike,
          null,
          null
        ),
        this.authService.getUserId()
      )
      .subscribe(() => {
        this.histoireService
          .updateHistoire(
            new Histoire(
              this.idHistoire ? this.idHistoire : 0,
              null,
              null,
              CategorieHistoire.Fantastique, // il s'agit d'une categorie par défaut, cela ne change pas la categorie d'origine
              CategorieAge.DeuxTroisAns, // il s'agit d'une categorie par défaut, cela ne change pas la categorie d'origine
              null,
              null,
              new Utilisateur(1, null, null, null, null, null) // il s'agit d'un utilisateur par défaut, cela ne change pas le créateur d'origine
            ),
            this.idHistoire ? this.idHistoire : 0
          )
          .subscribe();
      });
  }

  // Lors du clique sur le bouton favori
  changeFavori() {
    this.isFavori = !this.isFavori;
    if (this.isFavori) {
      this.listFavori?.push(this.histoire);
    } else {
      if (this.listFavori) {
        this.newListFavori = this.listFavori?.filter(
          (histoire) => histoire.id !== this.idHistoire
        );
        this.listFavori = this.newListFavori;
      }
    }

    this.utilisateurService
      .updateUtilisateur(
        new Utilisateur(
          this.authService.getUserId(),
          null,
          null,
          null,
          this.listFavori,
          null
        ),
        this.authService.getUserId()
      )
      .subscribe((utilisateur) => {
        console.log(this.listFavori);
      });
  }
}
