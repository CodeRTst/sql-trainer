import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { Quiz } from '../../models/quiz';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
    selector: 'app-test-quizzes',
    templateUrl: './test-quizzes.component.html',
    styleUrls: ['./test-quizzes.component.css']
})
export class TestQuizzesComponent implements AfterViewInit {
    displayedColumns: string[] = ['name', 'databaseName', 'startDate', 'endDate', 'status', 'evaluation', 'actions'];
    private _dataSource!: MatTableDataSource<Quiz>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Output() quizSelected: EventEmitter<number> = new EventEmitter<number>();




    ngAfterViewInit(): void {
        this._dataSource.sort = this.sort;
        this._dataSource.paginator = this.paginator;
    }





    navigateToQuiz(quizId: number) {
        this.quizSelected.emit(quizId);
    }



    hideButton(quiz: Quiz) {
        return quiz.attempt!.status == "CLOTURE" && quiz.attempt!.id == 0
    }



    iconButton(quiz: any) {
        if (quiz.attempt!.status == "PAS_COMMENCE")
            return "add_box";
        if (quiz.attempt!.status == "EN_COURS")
            return "edit";

        return "book";
    }


    matTooltip(quiz: Quiz): string {
        if (quiz.attempt!.status == "PAS_COMMENCE")
            return "commencer le quiz";
        if (quiz.attempt!.status == "EN_COURS")
            return "reprendre le quiz";

        return "Voir resultat du quiz";
    }



    status(quiz: Quiz) {
        return quiz.attempt!.status;
    }

    evaluation(quiz: Quiz) {
        return quiz.attempt!.evaluation == -1 ? "N/A" : `${quiz.attempt!.evaluation}/10`;
    }





    get dataSource() {
        return this._dataSource;
    }


    @Input() set dataSource(val: MatTableDataSource<Quiz>) {
        this._dataSource = val;
    }



}