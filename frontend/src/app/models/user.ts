import { Type } from "class-transformer";
import 'reflect-metadata';
import { differenceInYears } from 'date-fns';


export enum Role {
    Admin = 1,
    Teacher = 2,
    Student = 3
}



export class User {

    id?: number;
    pseudo?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    @Type(() => Date)
    birthDate?: Date;
    role: Role = Role.Admin;
    token?: string;


    public get roleAsString(): string {
        return Role[this.role];
    }


    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    }



    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = new Date();
        return differenceInYears(today, this.birthDate);
    }

}