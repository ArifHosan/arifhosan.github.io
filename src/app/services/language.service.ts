import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LanguageService {
    constructor(private http: HttpClient) { }

    getLanguages() {
        return this.http.get(`${environment.apiUrl}/languages/selected`);
    }
}
