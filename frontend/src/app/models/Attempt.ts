
import { Type } from "class-transformer";

export class Attempt {
    id!: number;
    @Type(() => Date)
    start!: Date;
    @Type(() => Date)
    finish?: Date;

    quizId?: number;
    status?: string;
    evaluation!: number;


    constructor(start: Date, quizId: number) {
        this.start = start;
        this.quizId = quizId;
    }
}