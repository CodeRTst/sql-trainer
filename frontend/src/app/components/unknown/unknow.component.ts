import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-unknown',
    template: `
    <h1>Unknown Page</h1>
    <p>The page you ask doesn't exist. You will be redirected automatically to your home page...</p>
    `
})

export class UnknownComponent implements OnInit {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate([this.getHomeRoute()]);
        }, 2000);
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

}
