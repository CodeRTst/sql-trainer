import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DefaultValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../interceptor/jwt.interceptor';
import { SharedModule } from './shared.module';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { fr } from 'date-fns/locale';

import { SetFocusDirective } from '../directives/setfocus.directive';
import { AppRoutes } from '../routing/app.routing';

import { AppComponent } from '../components/app/app.component';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { StudentQuizzesComponent } from '../components/student-quizzes/student-quizzes.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknow.component';
import { TrainingQuizzesComponent } from '../components/training-quizzes/training-quizzes.component';
import { TestQuizzesComponent } from '../components/test-quizzes/test-quizzes.component';
import { TeacherQuizzesComponent } from '../components/teacher-quizzes/teacher-quizzes.component';
import { EditQuizComponent } from '../components/edit-quiz/edit-quiz.component';
import { QuestionComponent } from '../components/questions/question.component';
import { CodeEditorComponent } from '../components/code-editor/code-editor.component';
import { QueryComponent } from '../components/query/query.component';
import { ClotureAttemptDialogComponent } from '../components/questions/cloture-attempt/cloture-attempt.component';
import { QuestionValidationComponent } from '../components/question-validation/question-validation.component';
import { SolutionValidationComponent } from '../components/solution-validation/solution-validation.component';
import { DeleteQuizDialogComponent } from '../components/edit-quiz/delete-quiz/delete-quiz.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    StudentQuizzesComponent,
    RestrictedComponent,
    LoginComponent,
    UnknownComponent,
    SetFocusDirective,
    TrainingQuizzesComponent,
    TestQuizzesComponent,
    TeacherQuizzesComponent,
    EditQuizComponent,
    QuestionValidationComponent,
    SolutionValidationComponent,
    DeleteQuizDialogComponent,
    QuestionComponent,
    CodeEditorComponent,
    QueryComponent,
    ClotureAttemptDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: fr },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['dd/MM/yyyy'],
        },
        display: {
          dateInput: 'dd/MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'dd/MM/yyyy',
          monthYearA11yLabel: 'MMM yyyy',
        },
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    DefaultValueAccessor.prototype.registerOnChange = function (fn: (_: string | null) => void): void {
      this.onChange = (value: string | null) => {
          fn(value === '' ? null : value);
      };
    };
  }
}
