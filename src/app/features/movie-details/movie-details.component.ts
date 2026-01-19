// FIXED: src/app/features/movie-details/movie-details.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieDetail } from '../../core/models/movie.model';
import { RuntimePipe } from '../../shared/pipes/runtime.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RuntimePipe, LoadingSpinnerComponent],
  template: `
    <div class="movie-details-container" *ngIf="!loading() && movie(); else loadingTemplate">
      <!-- Hero Section -->
      <div class="hero" [style.background-image]="'url(' + movie()!.Poster + ')'">
        <div class="hero-overlay">
          <div class="hero-content">
            <button class="back-btn" (click)="goBack()">← Back</button>
            <h1 class="movie-title">{{ movie()!.Title }}</h1>
            <div class="meta-info">
              <span class="rated">{{ movie()!.Rated }}</span>
              <span class="year">{{ movie()!.Year }}</span>
              <span class="runtime">{{ movie()!.Runtime | runtime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="main-section">
          <!-- Poster -->
          <div class="poster-section">
            <img 
              [src]="movie()!.Poster !== 'N/A' ? movie()!.Poster : 'assets/no-poster.png'" 
              [alt]="movie()!.Title"
              class="poster"
            />
            <button 
              class="favorite-btn-large"
              (click)="toggleFavorite()"
              [class.active]="isFavorite()"
            >
              {{ isFavorite() ? '❤️ Remove from Favorites' : '🤍 Add to Favorites' }}
            </button>
          </div>

          <!-- Details -->
          <div class="details-section">
            <div class="plot">
              <h2>Overview</h2>
              <p>{{ movie()!.Plot }}</p>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="label">Rating</span>
                <div class="rating">
                  <span class="imdb-rating">⭐ {{ movie()!.imdbRating }}</span>
                  <span class="votes">{{ movie()!.imdbVotes }} votes</span>
                </div>
              </div>

              <div class="info-item">
                <span class="label">Genre</span>
                <div class="genres">
                  <!-- FIX: Changed ?. to . -->
                  <span *ngFor="let genre of movie()!.Genre.split(', ')" class="genre-tag">
                    {{ genre }}
                  </span>
                </div>
              </div>

              <div class="info-item">
                <span class="label">Director</span>
                <span class="value">{{ movie()!.Director }}</span>
              </div>

              <div class="info-item">
                <span class="label">Actors</span>
                <span class="value">{{ movie()!.Actors }}</span>
              </div>

              <div class="info-item">
                <span class="label">Released</span>
                <span class="value">{{ movie()!.Released }}</span>
              </div>

              <div class="info-item" *ngIf="movie()!.Awards !== 'N/A'">
                <span class="label">Awards</span>
                <span class="value awards">🏆 {{ movie()!.Awards }}</span>
              </div>

              <div class="info-item" *ngIf="movie()!.BoxOffice !== 'N/A'">
                <span class="label">Box Office</span>
                <span class="value">{{ movie()!.BoxOffice }}</span>
              </div>

              <div class="info-item">
                <span class="label">Language</span>
                <span class="value">{{ movie()!.Language }}</span>
              </div>
            </div>

            <!-- Additional Ratings -->
            <!-- FIX: Changed ?. to . and added proper check -->
            <div class="ratings-section" *ngIf="movie()!.Ratings && movie()!.Ratings.length">
              <h3>Ratings</h3>
              <div class="ratings-list">
                <div *ngFor="let rating of movie()!.Ratings" class="rating-item">
                  <span class="source">{{ rating.Source }}</span>
                  <span class="score">{{ rating.Value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <app-loading-spinner />
    </ng-template>

    <div *ngIf="!loading() && !movie()" class="error-message">
      <h2>Movie not found</h2>
      <button (click)="goBack()">Go Back</button>
    </div>
  `,
  styles: [`
    .movie-details-container {
      min-height: 100vh;
      background: #0a0a0a;
    }

    .hero {
      height: 500px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .hero-overlay {
      height: 100%;
      background: linear-gradient(to top, #0a0a0a 0%, rgba(10, 10, 10, 0.7) 100%);
      display: flex;
      align-items: flex-end;
    }

    .hero-content {
      padding: 40px;
      width: 100%;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      margin-bottom: 20px;
      font-size: 14px;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .movie-title {
      font-size: 48px;
      font-weight: 900;
      color: #fff;
      margin: 0 0 12px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    .meta-info {
      display: flex;
      gap: 16px;
      font-size: 16px;
      color: #fff;
    }

    .rated, .year, .runtime {
      background: rgba(0, 0, 0, 0.6);
      padding: 4px 12px;
      border-radius: 4px;
    }

    .content {
      padding: 40px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .main-section {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 40px;
    }

    .poster {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .favorite-btn-large {
      width: 100%;
      padding: 14px;
      margin-top: 16px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .favorite-btn-large:hover {
      background: #b20710;
    }

    .favorite-btn-large.active {
      background: #333;
    }

    .plot h2 {
      color: #fff;
      margin-bottom: 16px;
    }

    .plot p {
      color: #ccc;
      line-height: 1.8;
      font-size: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-top: 32px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .label {
      color: #999;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .value {
      color: #fff;
      font-size: 16px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .imdb-rating {
      color: #f5c518;
      font-size: 20px;
      font-weight: 700;
    }

    .votes {
      color: #999;
      font-size: 14px;
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .genre-tag {
      background: #e50914;
      color: #fff;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
    }

    .awards {
      color: #f5c518;
    }

    .ratings-section {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #333;
    }

    .ratings-section h3 {
      color: #fff;
      margin-bottom: 16px;
    }

    .ratings-list {
      display: grid;
      gap: 12px;
    }

    .rating-item {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background: #1a1a1a;
      border-radius: 8px;
    }

    .source {
      color: #999;
    }

    .score {
      color: #fff;
      font-weight: 600;
    }

    .error-message {
      text-align: center;
      padding: 100px 20px;
      color: #fff;
    }

    .error-message button {
      margin-top: 20px;
      padding: 12px 24px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .main-section {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .movie-title {
        font-size: 32px;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private favoritesService = inject(FavoritesService);

  movie = signal<MovieDetail | null>(null);
  loading = signal(true);

  ngOnInit() {
    const imdbId = this.route.snapshot.paramMap.get('imdbId');
    if (imdbId) {
      this.loadMovieDetails(imdbId);
    }
  }

  loadMovieDetails(imdbId: string) {
    // FIX: Added proper typing for movie and error
    this.movieService.getMovieById(imdbId).subscribe({
      next: (movie: MovieDetail | null) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading movie details:', error);
        this.loading.set(false);
      }
    });
  }

  toggleFavorite() {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.favoritesService.toggleFavorite({
        imdbID: currentMovie.imdbID,
        Title: currentMovie.Title,
        Year: currentMovie.Year,
        Type: currentMovie.Type,
        Poster: currentMovie.Poster
      });
    }
  }

  isFavorite(): boolean {
    const currentMovie = this.movie();
    return currentMovie ? this.favoritesService.isFavorite(currentMovie.imdbID) : false;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}