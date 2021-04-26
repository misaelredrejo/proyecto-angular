import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Log } from './log.model';
import {Comment} from 'src/app/shared/comment.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private myAppUrl: string = 'https://localhost:44361/';
  private myApiCommentsUrl: string = 'api/comments/';
  private myApiLogsUrl: string = 'api/logs/';
  private myApiUserUrl: string = 'api/user/';

  constructor(private http: HttpClient) { 
  }

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


  public getUser(): Observable<string> {
    return this.http.get(this.myAppUrl + this.myApiUserUrl, { responseType: 'text', });
  }

  public getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.myAppUrl + this.myApiCommentsUrl);
  }

  public getCntCommentsSubPath(path: string): Observable<number> {
    return this.http.get<number>(this.myAppUrl + this.myApiCommentsUrl + "subpath/" + path);
  }

  public getLast10Logs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.myAppUrl + this.myApiLogsUrl + 'last10');
  }

  public getCommentsByPath(path: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.myAppUrl + this.myApiCommentsUrl + path);
  }

  public addComment(comment: Comment): Observable<Comment> {

    return this.http.post<Comment>(this.myAppUrl + this.myApiCommentsUrl, comment);
  }

  public updateComment(id: number, comment: Comment): Observable<any> {
    return this.http.put(this.myAppUrl + this.myApiCommentsUrl + id, comment);
  }

  public deleteComment(id: number, comment: Comment): Observable<any> {

    return this.http.delete(this.myAppUrl + this.myApiCommentsUrl + id);
  }


}
