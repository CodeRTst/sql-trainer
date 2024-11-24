import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash-es';
import { Quiz } from '../../models/quiz';
import { QuizService } from '../../services/quiz.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
    selector: 'app-teacher-quizzes',
    templateUrl: './teacher-quizzes.component.html',
    styleUrls: ['./teacher-quizzes.component.css']
})
export class TeacherQuizzesComponent implements AfterViewInit {
    displayedColumns: string[] = ['name', 'databaseName', 'isTest', 'status', 'startDate', 'endDate', 'actions'];
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;
    


    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


    constructor(
        private quizService: QuizService,
        private stateService: StateService,
        private router: Router,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        this.state = this.stateService.teacherQuizzesState;
    }




    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: Quiz, filter: string) => {
            const str = data.name + ' ' + data.description + ' ' + data.databaseName + ' ' + 
                        (data.startDate ? format(data.startDate!, 'dd/MM/yyyy') : 'N/A') + ' ' + 
                        (data.endDate ? format(data.endDate!, 'dd/MM/yyyy') : 'N/A')+ ' ' +  
                        (data.isTest ? 'test' : 'training');
                        
            return str.toLowerCase().includes(filter);
        };

        this.state.bind(this.dataSource);
        this.refresh();
    }



    refresh() {
        this.quizService.getAll().subscribe(quizzes => {
            this.dataSource.data = quizzes;
            this.state.restoreState(this.dataSource);
            this.filter = this.state.filter;
        });
    }



    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }



    create() {
        this.router.navigate(['/quizedition', 0]);
    }


    edit(quiz: Quiz) {
        this.router.navigate(['/quizedition', quiz.id]);
    }


    



}