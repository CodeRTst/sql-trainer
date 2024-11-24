import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    isExpanded = false;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    btnSqlTrainer() {
        this.router.navigate([this.getHomeRoute()]);
    }
    

    private getHomeRoute() {
        let user = this.authenticationService.currentUser;
        if (user) {
            if (user.role == Role.Teacher)
                return 'teacher';
            else if (user.role == Role.Student)
                return 'quizzes';
        }
        return 'login';
    }


    get currentUser() {
        return this.authenticationService.currentUser;
    }

    get isStudent() {
        return this.currentUser && this.currentUser.role === Role.Student;
    }

    get isTeacher() {
        return this.currentUser && this.currentUser.role === Role.Teacher;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
