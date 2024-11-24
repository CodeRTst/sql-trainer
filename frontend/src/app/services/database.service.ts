import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Database } from '../models/database';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class DatabaseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Database[]> {
        return this.http.get<Database[]>(`${this.baseUrl}api/databases`)
            .pipe(map(res => plainToInstance(Database, res)))
    }

}

