/* Angular Modules */
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

/* Material Angular */
import { MatDialog } from '@angular/material/dialog';

/* RxJs dependencies */
import { first } from 'rxjs/operators';

/* Services */
import { UserService } from '../../services/user.service';

/* Components */
import { SigninComponent } from '../signin/signin.component';
import { SignupFormService } from './services/signup-form.service';

/* Models */
import { AuthData } from '../../models/auth-data.model';
import { ErrorMessages } from './signup-errors';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    providers: [SignupFormService]
})
export class SignupComponent implements OnInit {
    signForm: FormGroup;
    errorMessages = ErrorMessages;
    captchaError: boolean;
    submit = false;
    captchaSiteKey = '6LczU6MUAAAAAGaba5u9Qt_Peq3_mKk6bKnZ72Ju';

    constructor(
        private userService: UserService,
        private signupFormService: SignupFormService,
        public dialog: MatDialog,
        private router: Router) {}

    ngOnInit() {
        this.signForm = this.signupFormService.buildForm();
        this.signForm.get('confirmPassword').valueChanges.subscribe(val => {
            if (SignupFormService.checkPasswords(this.signForm)) {
                this.signForm.get('confirmPassword').setErrors([{'passwordMismatch': true}]);
            }
        });
    }

    register(): void {
        this.submit = true;
        if (this.signForm.valid) {
            const authData = <AuthData>this.signForm.getRawValue();
            this.userService.register(authData)
                .pipe(first())
                .subscribe(
                    () => {},
                    () => {},
                    () => {
                        this.router.navigate(['/']);
                        this.login();
                    });
            this.captchaError = false;
        } else {
            Object.keys(this.signForm.controls).forEach((field => {
                const control = this.signForm.get(field);
                control.markAsTouched({onlySelf: true});
            }));
            this.captchaError = true;
        }
    }

    login(): void {
        this.dialog.open(SigninComponent);
    }

}