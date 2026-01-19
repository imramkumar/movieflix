import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movie, MovieDetail, SearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private baseUrl = environment.omdbBaseUrl;
  private cache = new Map<string, Observable<any>>();

  searchMovies(searchTerm: string, page: number = 1): Observable<SearchResponse> {
    const cacheKey = `search_${searchTerm}_${page}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('s', searchTerm)
      .set('type', 'movie')
      .set('page', page.toString());

    const request$ = this.http.get<SearchResponse>(this.baseUrl, { params })
      .pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Search error:', error);
          return of({ Search: [], totalResults: '0', Response: 'False', Error: 'Network error' } as SearchResponse);
        })
      );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getMovieById(imdbId: string): Observable<MovieDetail | null> {
    const cacheKey = `movie_${imdbId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('i', imdbId)
      .set('plot', 'full');

    const request$ = this.http.get<MovieDetail>(this.baseUrl, { params })
      .pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Movie details error:', error);
          return of(null);
        })
      );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getMoviesByGenre(genre: string, page: number = 1): Observable<SearchResponse> {
    return this.searchMovies(genre, page);
  }

  clearCache(): void {
    this.cache.clear();
  }
}