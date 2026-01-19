import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rating',
  standalone: true
})
export class RatingPipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value === 'N/A') return 'N/A';
    
    const rating = parseFloat(value);
    if (isNaN(rating)) return value;
    
    return `${(rating * 10).toFixed(0)}%`;
  }
}