import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.omdbBaseUrl)) {
    const clonedRequest = req.clone({
      setParams: {
        apikey: environment.omdbApiKey
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};