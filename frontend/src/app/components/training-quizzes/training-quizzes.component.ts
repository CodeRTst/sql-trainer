import { Component, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { Quiz } from '../../models/quiz';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StateService } from 'src/app/services/state.service';


@Component({
    selector: 'app-training-quizzes',
    templateUrl: './training-quizzes.component.html',
    styleUrls: ['./training-quizzes.component.css']
})
export class TrainingQuizzesComponent implements AfterViewInit {
    displayedColumns: string[] = ['name', 'databaseName', 'attemptStatus', 'actions'];
    private _dataSource!: MatTableDataSource<Quiz>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    @Output() quizSelected: EventEmitter<number> = new EventEmitter<number>();


    constructor(private stateService: StateService) {}


    ngAfterViewInit(): void {
        this._dataSource.sort = this.sort;
        this._dataSource.paginator = this.paginator;

        // this._dataSource.sortingDataAccessor = (item, property) => {
        //     switch (property) {
        //         case 'status':
        //             return item.attempt!.status;
        //     }
        // };
    }



    navigateToQuiz(quizId: number) {
        this.quizSelected.emit(quizId);
    }


    btnAdd(quiz: Quiz) {
        if (quiz.attempt!.status == "FINI")
            this.stateService.restartQuiz = true;

        this.navigateToQuiz(quiz.id);
    }




    hideAddButton(quiz: any) {
        return quiz.attempt!.status != "PAS_COMMENCE" && quiz.attempt!.status != "FINI";;
    }

    hideBookButton(quiz: any) {
        return quiz.attempt!.status != "FINI"; 
    }

    hideEditButton(quiz: any) {
        return quiz.attempt!.status != "EN_COURS";
    }



    matTooltip(quiz: Quiz): string {
        if (quiz.attempt!.status == "PAS_COMMENCE")
            return "commencer le quiz";

        return "recommencer le quiz";
    }



    status(quiz: Quiz) {
        return quiz.attempt!.status;
    }


    
    get dataSource() {
        return this._dataSource;
    }


    @Input() set dataSource(val: MatTableDataSource<Quiz>) {
        this._dataSource = val;
    }


}