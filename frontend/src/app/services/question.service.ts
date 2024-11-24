import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Question } from '../models/question';
import { Query } from '../models/query';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Solution } from '../models/solution';
import { Answer } from '../models/answer';


@Injectable({ providedIn: 'root' })
export class QuestionService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getFirstQuestionByQuiz(quizId: number): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}api/questions/firstQuestion/${quizId}`);
    }


    getQuestionWithAnswerById(questionId: number, attemptId: number): Observable<Question> {
        return this.http.get<Question>(`${this.baseUrl}api/questions/question/${questionId}/${attemptId}`)
            .pipe(map(res => plainToInstance(Question, res)))
    }


    postAnswer(answer: Answer) {
        return this.http.post<Answer>(`${this.baseUrl}api/questions/answer`, answer)
            .pipe(map(res => plainToInstance(Answer, res)))
    }


    getQueryResultByAnswer(questionId: number, codeSql: string): Observable<Query> {
        return this.http.post<Query>(`${this.baseUrl}api/questions/query`, {questionId, codeSql})
            .pipe(map(res => plainToInstance(Query, res)));
    }


    getSolutionsByQuestion(questionId: number): Observable<Solution[]> {
        return this.http.get<Solution[]>(`${this.baseUrl}api/questions/solutions/${questionId}`)
            .pipe(map(res => plainToInstance(Solution, res)))
    }




   
} 