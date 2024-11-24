import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuizService } from "src/app/services/quiz.service";
import { Database } from "src/app/models/database";
import { DatabaseService } from "src/app/services/database.service";
import { Quiz } from "src/app/models/quiz";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Question } from "src/app/models/question";
import { Solution } from "src/app/models/solution";
import { MatDialog } from "@angular/material/dialog";
import { DeleteQuizDialogComponent } from "./delete-quiz/delete-quiz.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { trim } from "lodash-es";

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.css']
})
export class EditQuizComponent implements OnInit {
  quizForm!: FormGroup;

  quizId!: number;
  isNew: boolean = true;
  quiz: Quiz = new Quiz();
  databases: Database[] = [];



  constructor(
    private quizService: QuizService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.setQuizId();

    this.initialize();
    this.loadData();

    // Fait en sorte que les formControls ont déjà été toucher pour afficher les erreurs des le début.
    this.quizForm.markAllAsTouched();
  }


  private setQuizId() {
    const param = this.route.snapshot.params['id'];
    this.verifyParamUrl(param);
    this.quizId = param;
    this.isNew = this.quizId == 0;
  }


  private verifyParamUrl(id: any) {
    if (isNaN(id))
      this.router.navigate(['**']);
  }



  private initialize() {

    this.quizForm = this.fb.group({
      name: ['', [Validators.required, this.minLengthValidator()], [this.nameUsedValidator()]],
      description: ['', [this.minLengthValidator()]],
      database: [null, [Validators.required]],
      isPublished: [false],
      isTest: [false],
      startDate: [null],
      endDate: [null],
      questions: this.fb.array([], [Validators.required])
    })

    this.initializeObservable();
  }


  private initializeObservable() {
    this.isTest!.valueChanges.subscribe(x => {
      if (!x) {
        this.startDate?.clearValidators();
        this.endDate?.clearValidators();
      }
      else {
        this.startDate?.addValidators(Validators.required);
        this.endDate?.addValidators([Validators.required, this.endDateValidator()]);
      }

      this.startDate?.updateValueAndValidity();
      this.endDate?.updateValueAndValidity();
    })
  }

  //------------------------GETTER-----------------------------------------------------------------------//

  getQuestion(index: number): FormGroup {
    return this.questionArray.at(index) as FormGroup;
  }

  getSolutions(questionIndex: number): FormArray {
    return this.getQuestion(questionIndex).get('solutions') as FormArray;
  }

  get name() {
    return this.quizForm.get('name');
  }

  get description() {
    return this.quizForm.get('description');
  }

  get database() {
    return this.quizForm.get('database');
  }


  get isTest() {
    return this.quizForm?.get('isTest');
  }

  get startDate() {
    return this.quizForm?.get('startDate');
  }

  get endDate() {
    return this.quizForm?.get('endDate');
  }

  get questionArray() {
    return this.quizForm!.get("questions") as FormArray;
  }




  //----------------------------LOAD DATA------------------------------------------------------------//

  private loadData() {
    this.databaseService.getAll().subscribe(databases => {
      this.databases = databases;
      if (!this.isNew)
        this.loadQuiz();
    });
  }


  private loadQuiz() {
    this.quizService.getQuizById(this!.quizId).subscribe(quiz => {
      this.quiz = quiz;
      this.quizForm.patchValue(this.quiz);
      this.database!.patchValue(this.databases.find(d => d.id == this.quiz.database?.id));
      this.questionsOnInit(this.quiz.questions);
    },
      (error) => {
        console.error(error);
        console.error("le quiz avec l'identifiant " + this.quizId + " n'existe pas.");
        this.router.navigate(['**']);
      });
  }


  private questionsOnInit(questions: Question[]): void {
    questions.forEach((q, index) => {

      this.questionArray.push(this.fb.group({
        id: [q.id],
        order: [q.order],
        body: [q.body, [Validators.required, Validators.minLength(3)]],
        solutions: this.fb.array([], Validators.required)

      }));

      this.solutionsOnInit(q.solutions, index);

    });
  }



  private solutionsOnInit(solutions: Solution[], index: number): void {
    var solutionArray = this.getSolutions(index);

    solutions.forEach((s) => {

      solutionArray.push(this.fb.group({
        id: [s.id],
        order: [s.order],
        sql: [s.sql, [Validators.required, Validators.minLength(3)]]

      }, [Validators.required]))

    })
  }




  //-----------------------------------VALIDATORS----------------------------------------------------------//

  minLengthValidator() {
    return (control: { value: string | null }) => {
      const txt = control.value;
      return txt && trim(txt).length < 3 ? { trimMinLength: true } : null;
    }
  }


  endDateValidator() {
    return (control: { value: Date | null }) => {
      const selectedDate = control.value;
      const maxDate = this.startDate?.value;
      return selectedDate && maxDate && selectedDate < maxDate ? { maxDate: true } : null;
    };
  }



  nameUsedValidator(): any {
    let timeout: NodeJS.Timeout;
    return (ctl: FormControl) => {
      clearTimeout(timeout);
      const name = ctl.value;
      return new Promise(resolve => {
        timeout = setTimeout(() => {
          if (ctl.pristine) {
            resolve(null);
          } else {
            this.quizService.getQuizByName(name).subscribe(quiz => {
              resolve(quiz ? { nameUsed: true } : null);
            });
          }
        }, 300);
      });
    };
  }


  //------------ON SUBMIT-------------------------------------------------------------------//


  public onSubmit() {
    this.setOrders();
    var quiz = this.quizForm.value;
    quiz.id = this.quiz.id;

    if (!quiz.isTest) {
      quiz.startDate = null;
      quiz.endDate = null;
    }

    if (this.isNew)
      this.postQuiz(quiz);

    else
      this.updateQuiz(quiz);
  }



  private setOrders() {
    this.questionArray.controls.forEach((q, index) => {
      q.get("order")?.setValue(index + 1);

      this.getSolutions(index).controls.forEach((s, index) => {
        s.get("order")?.setValue(index + 1);
      })

    })
  }



  private updateQuiz(quiz: any) {
    this.quizService.updateQuiz(quiz).subscribe(res => {
      this.quiz = res;
    })
    this.snackBar.open(`Le quiz "${this.quiz.name}" à été modifié.`, "ok", { duration: 3000 });
  }


  private postQuiz(quiz: any) {
    this.quizService.postQuiz(quiz).subscribe(res => {
      this.quiz = res;
      this.router.navigateByUrl(`quizedition/${this.quiz.id}`);
      this.isNew = this.quiz.id == 0;
      this.snackBar.open(`Le quiz "${this.quiz.name}" à été crée.`, "ok", { duration: 3000 });
    })
  }



  private delete() {
    this.quizService.deleteQuiz(this.quiz.id).subscribe(() => {
      this.router.navigate(['teacher']);
    });
    this.snackBar.open(`Le quiz "${this.quiz.name}" à été supprimé.`, "ok", { duration: 3000 });
  }
  


  openDeleteQuizDialog() {
    const dialogRef = this.dialog.open(DeleteQuizDialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      data: 'Attention, toutes les questions et tous les éssais associés seront supprimé. Êtes-vous sûr ?'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes')
        this.delete();
    });
  }


}
