import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm!: FormGroup;
  user: any;

  constructor() {
    this.login()
  }

  login() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).then((result: any) => {
        if (result) {
          this.authService.getUserByUid(result.user.uid).subscribe((userData) => {
            this.user = userData;
            this.router.navigate(['/home']);
          });
        }
      })
    }
  }
}
