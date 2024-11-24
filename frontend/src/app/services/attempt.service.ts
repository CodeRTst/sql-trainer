import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Attempt } from '../models/attempt';


@Injectable({ providedIn: 'root' })
export class AttemptService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    finishAttempt(id: number, quizId: number, finish: Date) {
        return this.http.post<Attempt>(`${this.baseUrl}api/attempts/finish`, {id, quizId, finish})
    }


    postAttempt(attempt: Attempt) {
        return this.http.post<Attempt>(`${this.baseUrl}api/attempts`, attempt)
            .pipe(map(res => plainToInstance(Attempt, res)))
    }


}

