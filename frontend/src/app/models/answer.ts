import { formatDate } from "@angular/common";
import { Type } from "class-transformer";
import { format } from "date-fns";


export class Answer {
    id!: number;
    sql!: string;
    @Type(() => Date)
    timestamp!: Date;
    isCorrect!: boolean;

    attemptId?:number;
    questionId?: number;

    constructor(sql: string, timestamp: Date, questionId: number, isCorrect: boolean, attemptId: number) {
        this.sql = sql;
        this.timestamp = timestamp;
        this.questionId = questionId;
        this.isCorrect = isCorrect;
        this.attemptId = attemptId;
    }


    public get formatTimestamp() {

        return this.timestamp ? format(this.timestamp, 'dd/MM/yyyy HH:mm:ss') : "hassan";
    } 
    
}

