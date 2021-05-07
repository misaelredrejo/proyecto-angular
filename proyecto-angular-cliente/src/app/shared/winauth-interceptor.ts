import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {  Router } from '@angular/router';
@Injectable()
export class WinAuthInterceptor implements HttpInterceptor{
    
  constructor(
    private router: Router
    ) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({ withCredentials: true });
        return next.handle(req).pipe(
          tap((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
              }
          }, (error) => {
            this.router.navigate(['/error/database']);
          })
      );;
    }
} 