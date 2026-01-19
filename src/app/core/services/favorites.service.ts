import { Injectable, signal, computed } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'movieFavorites';
  
  private favoritesSignal = signal(this.loadFromStorage());
  
  favorites = this.favoritesSignal.asReadonly();
  favoritesCount = computed(() => this.favoritesSignal().length);

  private loadFromStorage(): Movie[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(favorites: Movie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }

  addToFavorites(movie: Movie): void {
    const current = this.favoritesSignal();
    if (!this.isFavorite(movie.imdbID)) {
      const updated = [...current, movie];
      this.favoritesSignal.set(updated);
      this.saveToStorage(updated);
    }
  }

  removeFromFavorites(imdbId: string): void {
    const updated = this.favoritesSignal().filter(m => m.imdbID !== imdbId);
    this.favoritesSignal.set(updated);
    this.saveToStorage(updated);
  }

  isFavorite(imdbId: string): boolean {
    return this.favoritesSignal().some(m => m.imdbID === imdbId);
  }

  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie.imdbID)) {
      this.removeFromFavorites(movie.imdbID);
    } else {
      this.addToFavorites(movie);
    }
  }
}