import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieListComponent, LoadingSpinnerComponent],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1 class="hero-title">Discover Movies</h1>
        <p class="hero-subtitle">Explore thousands of movies across different genres</p>
      </div>

      <app-loading-spinner *ngIf="loading()" />

      <div *ngIf="!loading()" class="categories">
        <app-movie-list 
          *ngFor="let category of categories"
          [title]="category.title"
          [movies]="category.movies"
          [horizontal]="true"
        />
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      margin-bottom: 40px;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 900;
      color: #fff;
      margin: 0 0 12px 0;
    }

    .hero-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
    }

    .categories {
      margin-top: 40px;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 32px;
      }

      .hero-subtitle {
        font-size: 16px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  
  loading = signal(true);
  categories: Array<{title: string, movies: Movie[]}> = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const genres = ['action', 'drama', 'comedy', 'thriller','horror','romance'];
    
    forkJoin(
      genres.map(genre => this.movieService.searchMovies(genre, 1))
    ).subscribe({
      next: (responses) => {
        this.categories = genres.map((genre, index) => ({
          title: genre.charAt(0).toUpperCase() + genre.slice(1),
          movies: responses[index].Search || []
        }));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }
}
