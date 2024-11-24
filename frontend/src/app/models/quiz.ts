import { Type } from "class-transformer";
import 'reflect-metadata';
import { Database } from "./database";
import { Question } from "./question";
import { Attempt } from "./attempt";


export enum Status {
    PAS_COMMENCE,
    EN_COURS,
    CLOTURE,
    FINI
}



export class Quiz {

    id!: number;
    name!: string;
    description?: string;
    isPublished!: boolean;
    isClosed!: boolean;
    isTest!: boolean;
    @Type(() => Date)
    startDate?: Date;
    @Type(() => Date)
    endDate?: Date;

    status?:string;
    databaseId?: number;
    database?: Database;
    attempt?: Attempt;
    questions: Question[] = [];
    nbQuestions: number = -1;



    public get databaseName(): string {
        return this.database!.name;
    }

    public get attemptStatus() {
        return this.attempt?.status;
    }

    public get evaluation() {
        return this.attempt?.evaluation;
    }

    
}


