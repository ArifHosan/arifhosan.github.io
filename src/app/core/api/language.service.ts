import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment} from '../../../environments/environment';

const API_URL = environment.restApi;

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(public http:HttpClient) { }

  getAllLanguage() {
    return this.http.get<Language[]>(API_URL + 'languages');
  }
}
