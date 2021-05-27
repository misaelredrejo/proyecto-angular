import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import {Comment} from '../../models/comment.model';
import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';
import { Log } from 'src/app/models/log.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private myAppUrl: string = 'https://localhost:44361/';
  private myApiCommentsUrl: string = 'api/comments/';
  private myApiUserUrl: string = 'api/user/';
  private myApiLogsUrl: string = 'api/logs/';
  private myApiUserLogsUrl: string = 'api/userlogs/';

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

  /*public getJSONAsync(): Observable<any> {

    // Call the http GET
    return this.http.get("./../../assets/configuracionNPR.json").pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }*/

  //#region Usuario
  public getUserAsync(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiUserUrl);
  }

  public addUserAsync(user: User):Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.myAppUrl + this.myApiUserUrl, user);
  }

  public updateUserAsync(id: number, user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.myAppUrl + this.myApiUserUrl + id, user);
  }

  public getActiveUsersAsync(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiUserUrl + 'active');
  }

  //#endregion


  //#region Comentarios

  public getCntCommentsSubPathAsync(path: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + "subpath/" + path);
  }

  public getLast10CommentLogsAsync(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + 'commentlogs/last10');
  }

  public getLast2WeeksCommentLogsAsync(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + 'commentlogs/last2weeks');
  }

  public getCommentLogsByFilter(filter: {}): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + 'commentLogs/filter', {params: filter});
  }

  public getCommentsByPathAsync(path: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + path);
  }

  public addCommentAsync(comment: Comment): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl, comment);
  }

  public updateCommentAsync(id: number, comment: Comment): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.myAppUrl + this.myApiCommentsUrl + id, comment);
  }
  //#endregion

  //#region Logs
  public addLogAsync(log: Log) {
    return this.http.post<ApiResponse>(this.myAppUrl + this.myApiLogsUrl, log);
  }
  //#endregion

  //#region UserLog -> Logs no leidos por cada usuario
  public getPathHasUnreadLogsForUserAsync(userId: number, path: string) {
    return this.http.get<ApiResponse>(this.myAppUrl + this.myApiUserLogsUrl + userId + '/' + path);
  }
  //#endregion

}
