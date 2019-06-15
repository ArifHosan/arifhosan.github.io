import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SnippetService {
  BASE_URL = environment.restApi;
  constructor(public http: HttpClient) { }

  generateSnippet(data) {
    return this.http.post<any>(this.BASE_URL + 'snippets/', data);
  }

  getSnippet(id) {
    return this.http.get<any>(this.BASE_URL + 'snippets/' + id);
  }
}
