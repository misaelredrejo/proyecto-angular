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

  public getComments(): Comentario[] {
    return [
      {
        id: 1,
        idComentario: 1,
        usuario: "Misael",
        ruta: "/path/123",
        texto: "Comentario de prueba comentario de prueba 123 123",
        fechaBaja: new Date('2020-12-17'),
        fechaAlta: null
      },
      {
        id: 2,
        idComentario: 2,
        usuario: "Pepe",
        ruta: "/path/321",
        texto: "Otro comentario",
        fechaBaja: new Date('2020-12-17'),
        fechaAlta: null
      }
    ]
  }

  public getUser(): string {
    return "UsuarioPrueba";
  }

}
