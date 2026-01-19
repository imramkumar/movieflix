import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit {
  @Input() appLazyLoad: string = '';
  private el = inject(ElementRef);

  ngOnInit() {
    const img = this.el.nativeElement as HTMLImageElement;
    img.src = 'assets/placeholder.png'; // Add a placeholder image
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = this.appLazyLoad;
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(img);
  }
}