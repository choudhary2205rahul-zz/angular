import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
        catchError((err: HttpErrorResponse) => {
          let message: string = 'An unknown error occurred';
          if(err.error.message) {
            message = err.error.message;
          }
          this.dialog.open(ErrorComponent, {data: {message}});
          return throwError(err);
        })
    );
  }
}
