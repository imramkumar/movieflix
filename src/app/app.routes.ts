import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MovieDetailsComponent } from './features/movie-details/movie-details.component';
import { SearchComponent } from './features/search/search.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { GenreComponent } from './features/genre/genre.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'movie/:imdbId', component: MovieDetailsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'genre/:genreName', component: GenreComponent },
  { path: '**', redirectTo: '/home' }
];