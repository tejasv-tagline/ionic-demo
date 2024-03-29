import { Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './feature/auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./feature/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./feature/search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'chat-list',
        loadComponent: () =>
          import('./feature/chat/chat.page').then((m) => m.ChatPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./feature/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'chat-details/:id',
        loadComponent: () =>
          import(
            './feature/chat/components/chat-details/chat-details.page'
          ).then((m) => m.ChatDetailsPage),
      },
      {
        path: 'post/:postId',
        loadComponent: () =>
          import('./feature/post-detail/post-detail.page').then(
            (m) => m.PostDetailPage
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/auth/components/login/login.page').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./feature/auth/components/signup/signup.page').then(
        (m) => m.SignupPage
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
  // {
  //   path: 'profile-details',
  //   loadComponent: () => import('./feature/profile/components/profile-details/profile-details.page').then( m => m.ProfileDetailsPage)
  // },
];
