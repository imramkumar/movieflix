import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <input 
        type="text"
        [formControl]="searchControl"
        placeholder="Search for movies..."
        class="search-input"
      />
      <button 
        *ngIf="searchControl.value" 
        (click)="clearSearch()"
        class="clear-btn"
      >
        ✕
      </button>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
    }

    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      font-size: 16px;
      border: 2px solid #333;
      border-radius: 25px;
      background: #1a1a1a;
      color: #fff;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      border-color: #e50914;
    }

    .clear-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #999;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
    }

    .clear-btn:hover {
      color: #fff;
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() searchQuery = new EventEmitter<string>();
  
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.searchQuery.emit(value || '');
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}