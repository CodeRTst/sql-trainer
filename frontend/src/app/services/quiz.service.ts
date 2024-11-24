import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../models/quiz';
import { Observable, catchError, map, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class QuizService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Quiz[]> { 
        return this.http.get<Quiz[]>(`${this.baseUrl}api/quizzes`)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    getPublishedTrainingQuizzes(): Observable<Quiz[]> {   
        return this.http.get<Quiz[]>(`${this.baseUrl}api/quizzes/published/training`)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    getPublishedTestQuizzes(): Observable<Quiz[]> {      
        return this.http.get<Quiz[]>(`${this.baseUrl}api/quizzes/published/test`)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    getQuizById(id: number): Observable<Quiz> { 
        return this.http.get<Quiz>(`${this.baseUrl}api/quizzes/${id}`)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    getQuizByName(name: string) {
        return this.http.get<Quiz>(`${this.baseUrl}api/quizzes/name/${name}`)
            .pipe(map(res => plainToInstance(Quiz, res)),
                catchError(err => {
                    console.error(err);
                    return of(null);
                })
            )
    }

    getQuizByQuestion(questionId: number): Observable<Quiz> {
        return this.http.get<Quiz>(`${this.baseUrl}api/quizzes/question/${questionId}`)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    postQuiz(quiz: Quiz) {
        return this.http.post<Quiz>(`${this.baseUrl}api/quizzes`, quiz)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    updateQuiz(quiz: Quiz) {
        return this.http.put<Quiz>(`${this.baseUrl}api/quizzes`, quiz)
            .pipe(map(res => plainToInstance(Quiz, res)))
    }


    deleteQuiz(quizId: number) {
        return this.http.delete<any>(`${this.baseUrl}api/quizzes/${quizId}`);
    }


}

