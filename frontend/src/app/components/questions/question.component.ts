import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { QuestionService } from "src/app/services/question.service";
import { QuizService } from "src/app/services/quiz.service";
import { Query } from "src/app/models/query";
import { Solution } from "src/app/models/solution";
import { AttemptService } from "src/app/services/attempt.service";
import { MatDialog } from "@angular/material/dialog";
import { ClotureAttemptDialogComponent } from "./cloture-attempt/cloture-attempt.component";
import { StateService } from "src/app/services/state.service";
import { Attempt } from "src/app/models/attempt";
import { Answer } from "src/app/models/answer";
import { format } from "date-fns";



@Component({
    selector: 'app-question',
    templateUrl: '/question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent {
    quiz!: Quiz;
    question!: Question;
    param!: number;
    codeSql: string = "";
    query?: Query;
    solutions: Solution[] = [];
    clickedOnSend: boolean = false;

    constructor(
        private stateService: StateService,
        private questionService: QuestionService,
        private quizService: QuizService,
        private attemptService: AttemptService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.initializeParamUrl();
    }



    private verifyParamUrl(id: any) {
        if (isNaN(id))
            this.router.navigate(['**']);
    }


    private initializeParamUrl() {
        this.route.params.subscribe(params => {
            this.verifyParamUrl(params['id']);
            this.param = params['id'];

            if (this.quiz == undefined)
                this.initializeQuiz();
            else
                this.initializeQuestion();
        })
    }



    private initializeQuiz() {
        this.quizService.getQuizByQuestion(this.param).subscribe(quiz => {
            this.quiz = quiz;
            this.initializeQuestion();
        },
        (error) => {
          console.error(error);
          console.error("la question avec l'identifiant " + this.param + " n'existe pas.");
          this.router.navigate(['**']);
        });
    }





    private initializeQuestion() {
        this.reset();
        this.questionService.getQuestionWithAnswerById(this.param, this.quiz.attempt!.id).subscribe(question => {
            this.question = question;
            this.RestartQuiz();
            this.codeSql = this.question.answer ? this.question.answer.sql : "";
            if (this.canDisplayQuery)
                this.sqlRequest();
        })
    }


    private RestartQuiz() {
        if (this.stateService.restartQuiz) {
            this.quiz.attempt!.status = "PAS_COMMENCE";
            this.question.answer = undefined;
        }
    }



    private sqlRequest() {
        this.questionService.getQueryResultByAnswer(this.question.id, this.codeSql).subscribe(res => {
            this.query = res;
            if (this.canDisplaySolutions)
                this.getSolutions();

            if (this.clickedOnSend)
                this.postAnswer();
        });
    }


    private createAttempt() {
        return new Attempt(new Date(), this.quiz.id);
    }


    private createAnswer() {
        return new Answer(this.codeSql, new Date(), this.question.id, this.query!.errors.length == 0, this.quiz!.attempt!.id);
    }



    private postAnswer() {
        this.questionService.postAnswer(this.createAnswer()).subscribe(res => {
            this.question.answer = res;
        })
    }


    private postAttemptAndAnswer() {
        this.attemptService.postAttempt(this.createAttempt()).subscribe(attempt => {
            this.quiz.attempt = attempt;
            this.sqlRequest();
        })
    }




    getSolutions() {
        this.questionService.getSolutionsByQuestion(this.question.id).subscribe(solutions => {
            this.solutions = solutions;
        })
    }



    private reset() {
        this.query = undefined;
        this.solutions = [];
        this.clickedOnSend = false;
    }



    openClotureAttemptDialog() {
        const dialogRef = this.dialog.open(ClotureAttemptDialogComponent, {
            width: '600px',
            enterAnimationDuration: '1000ms',
            data: 'Attention, vous ne pourrez plus le modifier par après. Êtes-vous sûr ?'
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes')
                this.navigate();
        });
    }




    private navigate() {
        this.attemptService.finishAttempt(this.quiz.attempt!.id, this.quiz.id, new Date()).subscribe(res => {
            this.router.navigate(["quizzes"]);
        })
    }



    btnSendAction() {
        this.clickedOnSend = true;

        if (this.status == "PAS_COMMENCE") {
            this.stateService.restartQuiz = false;
            this.postAttemptAndAnswer();
        }
        else
            this.sqlRequest();
    }


    btnEraseAction() {
        this.reset();
        this.question.answer = undefined;
        this.codeSql = "";
    }


    btnSolutionAction() {
        this.getSolutions();
    }




    nextQuestion() {
        this.router.navigate(['question', this.question.id + 1]);
    }

    previousQuestion() {
        this.router.navigate(['question', this.question.id - 1]);
    }




    get isFirstQuestion(): boolean {
        return this.question.order === 1;
    }


    get isLastQuestion(): boolean {
        return this.question.order === this.quiz?.nbQuestions;
    }




    get btnSendHidden() {
        return this.btnHidden && this.hasAnswered;
    }

    get btnHidden() {
        return this.isFinishOrCloture || this.quiz.isTest;
    }


    get btnSolutionDisable() {
        return this.solutions.length != 0;
    }


    get btnEraseDisable() {
        return this.solutions.length == 0 && this.query == undefined;
    }


    get btnSendDisable() {
        return this.hasAnswered || !this.solutionsHidden;
    }

    get btnClotureDisable() {
        return this.status == "PAS_COMMENCE";
    }




    get canDisplayQuery() {
        return this.isFinishOrCloture || (!this.quiz.isTest && this.hasAnswered);
    }

    get canDisplaySolutions() {
        return this.isFinishOrCloture || (this.query!.queryAnswer != undefined && this.query!.queryAnswer.length > 0 && this.query!.errors.length == 0)
    }

    get queryHidden() {
        return this.query === undefined || this.query === null;
    }

    get solutionsHidden() {
        return this.solutions.length == 0;
    }


    get readOnly() {
        return this.isFinishOrCloture || this.hasAnswered;
    }

    get isFinishOrCloture() {
        return this.status == "FINI" || this.status == "CLOTURE";
    }


    get hasAnswered() {
        return this.question.answer != null && this.question.answer != undefined;
    }

    get status() {
        return this.quiz.attempt!.status;
    }
  


    get database() {
        return this.quiz.database?.name;
    }

    get title() {
        return `${this.quiz?.name} - exercice ${this.question.order}`;
    }


}