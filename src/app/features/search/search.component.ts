import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, MovieListComponent, LoadingSpinnerComponent],
  template: `
    <div class="search-container">
      <div class="search-header">
        <h1>Search Movies</h1>
        <app-search-bar (searchQuery)="onSearch($event)" />
      </div>

      <app-loading-spinner *ngIf="loading()" />

      <div *ngIf="!loading() && searchResults().length > 0" class="results">
        <p class="results-count">Found {{ totalResults() }} results</p>
        <app-movie-list [movies]="searchResults()" />
        
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

      <div *ngIf="!loading() && searchQuery() && searchResults().length === 0" class="no-results">
        <h2>No movies found</h2>
        <p>Try searching with different keywords</p>
      </div>

      <div *ngIf="!searchQuery() && !loading()" class="empty-state">
        <h2>🔍 Start searching for movies</h2>
        <p>Enter a movie title in the search bar above</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
    }

    .search-header {
      margin-bottom: 40px;
    }

    .search-header h1 {
      color: #fff;
      font-size: 36px;
      margin-bottom: 24px;
    }

    .results-count {
      color: #999;
      margin-bottom: 24px;
      font-size: 16px;
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

    .no-results, .empty-state {
      text-align: center;
      padding: 100px 20px;
      color: #fff;
    }

    .no-results h2, .empty-state h2 {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .no-results p, .empty-state p {
      color: #999;
      font-size: 18px;
    }
  `]
})
export class SearchComponent {
  private movieService = inject(MovieService);

  searchResults = signal<Movie[]>([]);
  loading = signal(false);
  searchQuery = signal('');
  currentPage = signal(1);
  totalResults = signal(0);
  totalPages = signal(0);

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    
    if (query.trim()) {
      this.performSearch(query, 1);
    } else {
      this.searchResults.set([]);
      this.totalResults.set(0);
    }
  }

  performSearch(query: string, page: number) {
    this.loading.set(true);
    
    this.movieService.searchMovies(query, page).subscribe({
      next: (response) => {
        if (response.Response === 'True') {
          this.searchResults.set(response.Search);
          this.totalResults.set(parseInt(response.totalResults));
          this.totalPages.set(Math.ceil(parseInt(response.totalResults) / 10));
        } else {
          this.searchResults.set([]);
          this.totalResults.set(0);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      const newPage = this.currentPage() + 1;
      this.currentPage.set(newPage);
      this.performSearch(this.searchQuery(), newPage);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      const newPage = this.currentPage() - 1;
      this.currentPage.set(newPage);
      this.performSearch(this.searchQuery(), newPage);
    }
  }
}

