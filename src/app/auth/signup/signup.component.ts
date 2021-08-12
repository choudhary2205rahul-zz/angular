import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Auth} from "../../models/auth.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    isLoading = false;

    constructor(public authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password).subscribe(response => {
            if (response) {
                this.router.navigate(['/login']);
            }
        }, error => {
            this.isLoading = false;
            console.log(error);
        });
    }

}
