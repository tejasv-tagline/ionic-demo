import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./feature/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/components/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./feature/auth/components/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  }
];
