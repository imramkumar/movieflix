import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'runtime',
  standalone: true
})
export class RuntimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value === 'N/A') return 'N/A';
    
    const minutes = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(minutes)) return value;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
}