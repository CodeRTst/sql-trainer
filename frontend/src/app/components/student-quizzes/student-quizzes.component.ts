import { AfterViewInit, Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quiz } from "src/app/models/quiz";
import { QuestionService } from "src/app/services/question.service";
import { QuizService } from "src/app/services/quiz.service";
import { StateService } from "src/app/services/state.service";



@Component({
    selector: 'app-student-quizzes',
    templateUrl: './student-quizzes.component.html'
})
export class StudentQuizzesComponent implements AfterViewInit {

    dataSourceTraining: MatTableDataSource<Quiz> = new MatTableDataSource();
    dataSourceTest: MatTableDataSource<Quiz> = new MatTableDataSource();

    stateTraining: MatTableState;
    stateTest: MatTableState;

    filter: string = '';



    constructor(
        private quizService: QuizService,
        private questionService: QuestionService,
        private stateService: StateService,
        private router: Router
    ) {
        this.stateTraining = this.stateService.trainingQuizzesState;
        this.stateTest = this.stateService.testQuizzesState;
        this.stateService.restartQuiz = false;
    }



    ngAfterViewInit(): void {

        this.dataSourceTraining.filterPredicate = (data: Quiz, filter: string) => {
            const str = data.name + ' ' + data.description + ' ' + data.databaseName;
            return str.toLowerCase().includes(filter);
        }

        this.dataSourceTest.filterPredicate = (data: Quiz, filter: string) => {
            const str = data.name + ' ' + data.description + ' ' + data.attempt?.status + '' + 
                        data.databaseName + (data.startDate ? format(data.startDate!, 'dd/MM/yyyy') : '') + ' ' + 
                        (data.endDate ? format(data.endDate!, 'dd/MM/yyyy') : '') + 
                        (data.evaluation! > -1 ? data.evaluation + "/10" : "N/A");

            return str.toLowerCase().includes(filter);
        };


        this.stateTraining.bind(this.dataSourceTraining);
        this.stateTest.bind(this.dataSourceTest);

        this.refresh();
    }



    refresh() {
        this.quizService.getPublishedTrainingQuizzes().subscribe(quizzes => {
            this.dataSourceTraining.data = quizzes;
            this.stateTraining.restoreState(this.dataSourceTraining);
            this.filter = this.stateTraining.filter;
        });

        this.quizService.getPublishedTestQuizzes().subscribe(quizzes => {
            this.dataSourceTest.data = quizzes;
            this.stateTest.restoreState(this.dataSourceTest);
            this.filter = this.stateTest.filter;
        });
    }



    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSourceTraining.filter = filterValue.trim().toLowerCase();
        this.dataSourceTest.filter = filterValue.trim().toLowerCase();

        // sauve le nouveau filtre dans le state
        this.stateTraining.filter = this.dataSourceTraining.filter;
        this.stateTest.filter = this.dataSourceTest.filter;

        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSourceTraining.paginator)
            this.dataSourceTraining.paginator.firstPage();

        if (this.dataSourceTest.paginator)
            this.dataSourceTest.paginator.firstPage();
    }


    
    navigateToQuiz(quizId: number) {
        this.questionService.getFirstQuestionByQuiz(quizId).subscribe(res => {
            this.router.navigate(["question", res]);
        });
    }


}