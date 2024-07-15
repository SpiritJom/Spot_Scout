// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OTPVerificationComponent } from './components/otp-verification/otp-verification.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';
import { SuperUserGuard } from './super-user.guard';
import { AdminComponent } from './components/admin/admin.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, SuperUserGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verify-otp',
    component: OTPVerificationComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password-confirm/:uidb64/:token',
    component: SetNewPasswordComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

