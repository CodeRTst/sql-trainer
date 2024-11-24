import { RouterModule, Routes } from "@angular/router";
import { StudentQuizzesComponent } from "../components/student-quizzes/student-quizzes.component";
import { AuthGuard } from "../services/auth.guard";
import { Role } from "../models/user";
import { RestrictedComponent } from "../components/restricted/restricted.component";
import { LoginComponent } from "../components/login/login.component";
import { UnknownComponent } from "../components/unknown/unknow.component";
import { TeacherQuizzesComponent } from "../components/teacher-quizzes/teacher-quizzes.component";
import { EditQuizComponent } from "../components/edit-quiz/edit-quiz.component";
import { QuestionComponent } from "../components/questions/question.component";


const appRoutes: Routes = [
    { path: 'quizzes', component: StudentQuizzesComponent, canActivate: [AuthGuard], data: {roles: [Role.Student]  } },
    { path: 'teacher', component: TeacherQuizzesComponent, canActivate: [AuthGuard], data: {roles: [Role.Teacher]  } },
    { path: 'quizedition/:id', component: EditQuizComponent, canActivate: [AuthGuard], data: {roles: [Role.Teacher] } },
    { path: 'login', component: LoginComponent },
    { path: 'question/:id', component: QuestionComponent, canActivate: [AuthGuard], data: {roles: [Role.Student] } },
    { path: 'restricted', component: RestrictedComponent },
    { path: '**', component: UnknownComponent }
];


export const AppRoutes = RouterModule.forRoot(appRoutes);