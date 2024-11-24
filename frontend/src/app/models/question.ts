import { Answer } from "./answer";
import { Quiz } from "./quiz";
import { Solution } from "./solution";


export class Question {
    id!: number;
    order!: number;
    body!: number;


    quiz?: Quiz;
    solutions: Solution[] = [];
    answer?: Answer;
}