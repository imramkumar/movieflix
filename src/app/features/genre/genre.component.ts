import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, MovieListComponent, LoadingSpinnerComponent],
  template: `
    <div class="genre-container">
      <div class="header">
        <h1>{{ genreName() | titlecase }}</h1>
        <p *ngIf="!loading() && movies().length > 0" class="count">
          {{ totalResults() }} movies found
        </p>
      </div>

      <app-loading-spinner *ngIf="loading()" />

      <div *ngIf="!loading() && movies().length > 0">
        <app-movie-list [movies]="movies()" />
        
        <div *ngIf="totalResults() > 10" class="pagination">
          <button 
            (click)="previousPage()" 
            [disabled]="currentPage() === 1"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
          <button 
            (click)="nextPage()" 
            [disabled]="currentPage() >= totalPages()"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>

      <div *ngIf="!loading() && movies().length === 0" class="no-results">
        <h2>No movies found in this genre</h2>
      </div>
    </div>
  `,
  styles: [`
    .genre-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 40px;
    }

    .header h1 {
      color: #fff;
      font-size: 36px;
      margin-bottom: 8px;
    }

    .count {
      color: #999;
      font-size: 16px;
      margin: 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 40px;
      padding: 20px;
    }

    .page-btn {
      padding: 10px 24px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: #b20710;
    }

    .page-btn:disabled {
      background: #333;
      cursor: not-allowed;
    }

    .page-info {
      color: #fff;
      font-size: 16px;
    }

    .no-results {
      text-align: center;
      padding: 100px 20px;
      color: #fff;
    }
  `]
})
export class GenreComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  genreName = signal('');
  movies = signal<Movie[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalResults = signal(0);
  totalPages = signal(0);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const genre = params.get('genreName');
      if (genre) {
        this.genreName.set(genre);
        this.loadGenreMovies(genre, 1);
      }
    });
  }

  loadGenreMovies(genre: string, page: number) {
    this.loading.set(true);
    
    this.movieService.getMoviesByGenre(genre, page).subscribe({
      next: (response) => {
        if (response.Response === 'True') {
          this.movies.set(response.Search);
          this.totalResults.set(parseInt(response.totalResults));
          this.totalPages.set(Math.ceil(parseInt(response.totalResults) / 10));
        } else {
          this.movies.set([]);
          this.totalResults.set(0);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Genre loading error:', error);
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      const newPage = this.currentPage() + 1;
      this.currentPage.set(newPage);
      this.loadGenreMovies(this.genreName(), newPage);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      const newPage = this.currentPage() - 1;
      this.currentPage.set(newPage);
      this.loadGenreMovies(this.genreName(), newPage);
    }
  }
}