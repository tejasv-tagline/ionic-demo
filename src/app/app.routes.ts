import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/dashboard/dashboard.page').then((m) => m.DashboardPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./feature/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'search',
        loadComponent: () => import('./feature/search/search.page').then(m => m.SearchPage)
      },
      {
        path: 'chat',
        loadComponent: () => import('./feature/chat/chat.page').then(m => m.ChatPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ]
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
    path: '**',
    redirectTo: 'login',
  },
];
