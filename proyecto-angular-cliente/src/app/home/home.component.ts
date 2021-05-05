import { Component, OnInit, } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { CommentDTO } from '../models/commentdto.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogRolComponent } from './dialog-rol/dialog-rol.component';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { SpinnerService } from '../shared/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  commentLogList: CommentDTO[] = [];
  username: string;
  rolValue: number;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.apiService.getLast10Logs().subscribe(data => {
      this.commentLogList = data;
    }), error => {
      console.log(error);
    };

    this.apiService.getUser().subscribe(data => {
      this.user = data;
      this.authenticationService.login(this.user);
    }, error => {
      if (error.status == 404) { // si el usuario no está en la base de datos
        this.openDialogChooseUserRol();
      } else {
        console.log(error);
      }
    });
    
  }

  openDialogChooseUserRol() {

    const dialogRef = this.dialog.open(DialogRolComponent, {
      width: '300px',
      data: { rolValue: this.rolValue },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      let user: User = {
        userId: 0,
        rol: result
      };
      this.apiService.addUser(user).subscribe(data => {
        this.user = data;
        this.authenticationService.login(this.user);
      }, error => {
        console.log(error);
      })
    });

  }

}
