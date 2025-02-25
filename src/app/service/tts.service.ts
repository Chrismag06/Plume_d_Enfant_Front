import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {

  private apiUrl = 'http://localhost:8080/tts/speak';
  private apiKey = 'TON_API_KEY'; // Remplace par ta clé API

  constructor(private http: HttpClient) {}

  getSpeech(text: string, ssml: boolean = false) {
    const params = { text, ssml: ssml.toString() };
    return this.http.get(this.apiUrl, { 
      params, 
      responseType: 'blob'  // On récupère un fichier audio (MP3)
    });
  }


}
