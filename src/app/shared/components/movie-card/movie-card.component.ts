import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { LazyLoadImageDirective } from '../../directives/lazy-load-image.directive';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, LazyLoadImageDirective],
  template: `
    <div class="movie-card" (click)="navigateToDetails()">
      <div class="poster-container">
        <img 
          [appLazyLoad]="movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png'"
          [alt]="movie.Title"
          class="poster"
        />
        <div class="overlay">
          <button 
            class="favorite-btn" 
            (click)="toggleFavorite($event)"
            [class.active]="isFavorite()"
          >
            <i class="heart-icon">{{ isFavorite() ? '❤️' : '🤍' }}</i>
          </button>
        </div>
      </div>
      <div class="info">
        <h3 class="title">{{ movie.Title }}</h3>
        <p class="year">{{ movie.Year }}</p>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      cursor: pointer;
      transition: transform 0.3s ease;
      border-radius: 8px;
      overflow: hidden;
      background: #1a1a1a;
    }

    .movie-card:hover {
      transform: scale(1.05);
    }

    .poster-container {
      position: relative;
      aspect-ratio: 2/3;
      overflow: hidden;
    }

    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .movie-card:hover .overlay {
      opacity: 1;
    }

    .favorite-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      font-size: 24px;
      transition: transform 0.2s ease;
    }

    .favorite-btn:hover {
      transform: scale(1.2);
    }

    .info {
      padding: 12px;
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .year {
      font-size: 12px;
      color: #999;
      margin: 0;
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  navigateToDetails(): void {
    this.router.navigate(['/movie', this.movie.imdbID]);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.imdbID);
  }
}
