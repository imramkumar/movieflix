import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritesService } from './core/services/favorites.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="header">
        <nav class="navbar">
          <div class="nav-brand" (click)="navigateHome()">
            🎬 MovieFlix
          </div>
          
          <ul class="nav-menu">
            <li>
              <a routerLink="/home" routerLinkActive="active">Home</a>
            </li>
            <li>
              <a routerLink="/search" routerLinkActive="active">Search</a>
            </li>
            <li class="genre-dropdown">
              <a>Genres ▾</a>
              <ul class="dropdown-menu">
                <li><a routerLink="/genre/action">Action</a></li>
                <li><a routerLink="/genre/drama">Drama</a></li>
                <li><a routerLink="/genre/comedy">Comedy</a></li>
                <li><a routerLink="/genre/thriller">Thriller</a></li>
                <li><a routerLink="/genre/horror">Horror</a></li>
                <li><a routerLink="/genre/romance">Romance</a></li>
              </ul>
            </li>
            <li>
              <a routerLink="/favorites" routerLinkActive="active" class="favorites-link">
                ❤️ Favorites
                <span *ngIf="favoritesCount() > 0" class="badge">
                  {{ favoritesCount() }}
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet />
      </main>

      <footer class="footer">
        <p>© 2026 MovieFlix. Powered by OMDb API</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #0a0a0a;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 40px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .nav-brand {
      font-size: 28px;
      font-weight: 900;
      color: #e50914;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .nav-brand:hover {
      transform: scale(1.05);
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 32px;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    .nav-menu a {
      color: #fff;
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      transition: color 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-menu a:hover {
      color: #e50914;
    }

    .nav-menu a.active {
      color: #e50914;
      font-weight: 700;
    }

    .genre-dropdown {
      position: relative;
    }

    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: #1a1a1a;
      border-radius: 8px;
      padding: 8px 0;
      min-width: 150px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      list-style: none;
      margin: 8px 0 0 0;
    }

    .genre-dropdown:hover .dropdown-menu {
      display: block;
    }

    .dropdown-menu li {
      margin: 0;
    }

    .dropdown-menu a {
      padding: 12px 16px;
      display: block;
      color: #fff;
      font-size: 14px;
    }

    .dropdown-menu a:hover {
      background: #333;
      color: #e50914;
    }

    .favorites-link {
      position: relative;
    }

    .badge {
      background: #e50914;
      color: #fff;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 700;
    }

    .main-content {
      flex: 1;
    }

    .footer {
      background: #000;
      padding: 24px;
      text-align: center;
      color: #666;
      margin-top: auto;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 16px;
        padding: 16px 20px;
      }

      .nav-menu {
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .nav-menu a {
        font-size: 14px;
      }
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);
  
  favoritesCount = this.favoritesService.favoritesCount;

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
