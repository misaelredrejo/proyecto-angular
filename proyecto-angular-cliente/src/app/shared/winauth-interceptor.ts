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
import { SpinnerService } from './spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable()
export class WinAuthInterceptor implements HttpInterceptor{
    
  constructor(
    private spinnerService: SpinnerService,
    private route: ActivatedRoute,
    private router: Router
    ) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.spinnerService.show();
        req = req.clone({ withCredentials: true });
        return next.handle(req).pipe(
          tap((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  this.spinnerService.hide();
              }
          }, (error) => {
            this.router.navigate(['/error']);
              this.spinnerService.hide();
          })
      );;
    }
} 