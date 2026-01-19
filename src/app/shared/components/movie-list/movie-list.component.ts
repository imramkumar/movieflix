import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="movie-list">
      <h2 *ngIf="title" class="list-title">{{ title }}</h2>
      <div class="movies-grid" [class.horizontal]="horizontal">
        <app-movie-card 
          *ngFor="let movie of movies" 
          [movie]="movie"
        />
      </div>
    </div>
  `,
  styles: [`
    .movie-list {
      margin-bottom: 40px;
    }

    .list-title {
      color: #fff;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 20px;
    }

    .movies-grid.horizontal {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 15px;
      padding-bottom: 10px;
    }

    .movies-grid.horizontal app-movie-card {
      flex: 0 0 180px;
      scroll-snap-align: start;
    }

    @media (max-width: 768px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
      }
    }
  `]
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];
  @Input() title: string = '';
  @Input() horizontal: boolean = false;
}