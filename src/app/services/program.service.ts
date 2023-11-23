import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProgramService {
    constructor(private http: HttpClient) { }

    create(body: any) {
        return this.http.post(`${environment.apiUrl}/programs`, body);
    }
    get(uuid: string) {
        return this.http.get(`${environment.apiUrl}/programs/${uuid}`);
    }
}
