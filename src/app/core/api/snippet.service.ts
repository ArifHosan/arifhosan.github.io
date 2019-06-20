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
    return this.http.post<Snippet>(this.BASE_URL + 'snippets/', data);
  }

  getSnippet(id) {
    return this.http.get<Snippet[]>(this.BASE_URL + 'snippets/' + id);
  }

  updateSnippet(id, data) {
    return this.http.put<Snippet>(this.BASE_URL + 'snippets/' + id, data);
  }
}
