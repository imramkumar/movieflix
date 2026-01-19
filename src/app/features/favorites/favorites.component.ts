import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieListComponent } from '../../shared/components/movie-list/movie-list.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieListComponent],
  template: `
    <div class="favorites-container">
      <div class="header">
        <h1>My Favorites</h1>
        <p class="count">{{ favoritesCount() }} movies</p>
      </div>

      <div *ngIf="favorites().length > 0; else emptyState">
        <app-movie-list [movies]="favorites()" />
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="icon">❤️</div>
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites list</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .favorites-container {
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

    .empty-state {
      text-align: center;
      padding: 100px 20px;
    }

    .icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .empty-state h2 {
      color: #fff;
      font-size: 32px;
      margin-bottom: 12px;
    }

    .empty-state p {
      color: #999;
      font-size: 18px;
    }
  `]
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  
  favorites = this.favoritesService.favorites;
  favoritesCount = this.favoritesService.favoritesCount;
}
