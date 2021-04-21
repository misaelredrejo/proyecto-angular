import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Comentario } from './comentario.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private myAppUrl: string = 'https://localhost:44361/';
  private myApiComentariosUrl: string = 'api/comentarios/';
  private myApiUserUrl: string = 'api/user/';

  constructor(private http: HttpClient) { }

  /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  /**
   * Function to extract the data when the server return some
   *
   * @param res
   */
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public getJSON(): Observable<any> {

    // Call the http GET
    return this.http.get("./../../assets/configuracionNPR.json").pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }


  public getUser(): Observable<any> {
    return this.http.get(this.myAppUrl + this.myApiUserUrl, { responseType: 'text', withCredentials: true });
  }

  public getCommentsByPath(path: string): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.myAppUrl + this.myApiComentariosUrl + path);
  }

  public getNextIdComentario(): Observable<number> {
    return this.http.get<Comentario[]>(this.myAppUrl + this.myApiComentariosUrl).pipe(
      // Get max value from an array
      map(data => Math.max.apply(Math, data.map(function (o) { return o.idComentario+1; }))),
      catchError(this.handleError)
    );
  }

  public addComment(comentario: Comentario): Observable<Comentario> {

    return this.http.post<Comentario>(this.myAppUrl + this.myApiComentariosUrl, comentario);
  }

  public updateComment(id: number, comentario: Comentario): Observable<any> {
    return this.http.put(this.myAppUrl + this.myApiComentariosUrl + id, comentario);
  }

  public deleteComment(id: number): Observable<any> {

    return this.http.delete(this.myAppUrl + this.myApiComentariosUrl + id);
  }


}
