import { Component, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  private map: any;
  private tokenCheckInterval: any;
  @ViewChild('latInput') latInput!: ElementRef<HTMLInputElement>;
  @ViewChild('lonInput') lonInput!: ElementRef<HTMLInputElement>;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.checkSession();
    this.startTokenCheck();
  }

  ngOnDestroy() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    if (this.map) {
      this.map.off(); // Remove all event listeners
      this.map.remove(); // Completely remove the map instance
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import leaflet in the browser environment
      import('leaflet').then(L => {
        this.initMap(L);
      });
    }
  }

  private initMap(L: any): void {
    // Check if the map container already has a map instance
    const mapContainer = document.getElementById('map');
    if (mapContainer && (mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null; // Clear the previous map instance
    }

    const bounds = [
      [5.0, 97.0],  // Southwest coordinates of Thailand
      [21.0, 106.0] // Northeast coordinates of Thailand
    ];

    this.map = L.map('map', {
      center: [15.8700, 100.9925],
      zoom: 6,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      dragging: false // ปิดการลากแผนที่เมื่อเริ่มต้น
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // จำกัดการซูมเข้าไปเท่ากับขนาดตอนเริ่มต้น
    this.map.setMinZoom(6);

    // เมื่อทำการซูมเข้า ให้เปิดใช้งานการลากแผนที่
    this.map.on('zoomend', () => {
      if (this.map.getZoom() > 6) {
        this.map.dragging.enable();
      } else {
        this.map.dragging.disable();
      }
    });

    // เมื่อคลิกที่แผนที่
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat.toFixed(4);
      const lon = e.latlng.lng.toFixed(4);
      this.latInput.nativeElement.value = lat;
      this.lonInput.nativeElement.value = lon;
    });
  }

  private checkSession() {
    const accessToken = this.cookieService.get('access_token');
    const refreshToken = this.cookieService.get('refresh_token');
    if (!accessToken && refreshToken) {
      // Attempt to refresh token if access token is missing but refresh token exists
      this.apiService.refreshToken().subscribe({
        next: () => {},
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else if (!accessToken && !refreshToken) {
      // Both tokens are missing, redirect to login
      this.router.navigate(['/login']);
    }
  }

  private startTokenCheck() {
    this.tokenCheckInterval = setInterval(() => {
      if (this.authService.isAccessTokenExpired()) {
        this.apiService.refreshToken().subscribe({
          next: () => {},
          error: () => {
            if (this.authService.isRefreshTokenExpired()) {
              this.showSessionExpiredAlert();
            }
          }
        });
      } else if (this.authService.isRefreshTokenExpired()) {
        this.showSessionExpiredAlert();
      }
    }, 5000); // Check every 2.5 minutes
  }

  private showSessionExpiredAlert() {
    Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.authService.logout();
    });
  }

  logout() {
    const refreshToken = this.apiService.getCookie('refresh_token');
    if (refreshToken) {
      this.apiService.logoutUser(refreshToken).subscribe(
        (response) => {
          console.log('Logout successful', response);
          this.apiService.clearToken();
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Logout failed', error);
          this.apiService.clearToken();
          this.router.navigate(['/login']);
        }
      );
    }
  }
}
