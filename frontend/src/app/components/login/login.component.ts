import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  errorMessage = '';
  debugMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.debugMessage = 'Login Component Loaded';
    // Check if user is already logged in
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.apiService.loginUser(this.credentials).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.apiService.setToken(response.access_token, response.refresh_token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('access_token');
  }
}
