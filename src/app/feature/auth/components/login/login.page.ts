import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private localstorageService = inject(LocalstorageService);
  private router = inject(Router);
  loginForm!: FormGroup;
  user: any;
  isToastOpen = false;

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
            this.localstorageService.setItem('userDetails',userData);
            this.router.navigate(['/home']);
          });
        }
      }).catch((error) => {
        this.isToastOpen = true;
      });
    }
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
