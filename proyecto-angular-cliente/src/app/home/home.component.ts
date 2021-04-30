import { Component, OnInit, } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Log } from '../shared/models/log.model';
import { Action, Rol } from '../shared/models/enums.model';
import { CommentDTO } from '../shared/models/commentdto.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogRolComponent } from './dialog-rol/dialog-rol.component';
import { User } from '../shared/models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  user: User;
  commentLogList: CommentDTO[] = [];
  username: string;
  rol: string;

  constructor(private apiService: ApiService, public dialog: MatDialog, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.apiService.getLast10Logs().subscribe(data => {
      this.commentLogList = data;
    }), error => {
      console.log(error);
    };


    this.apiService.getUsername().subscribe(data => {
      this.username = data;
      this.authenticationService.authenticate(this.username);

      this.apiService.userExistsInDb(this.username).subscribe(data => {
        if (data == false) {
          this.openDialogChooseUserRol();
        }
      }, error => {
        console.log(error);
      });

    }, error => {
      console.log(error);
    });

  }

  openDialogChooseUserRol() {

    const dialogRef = this.dialog.open(DialogRolComponent, {
      width: '250px',
      data: {rol: this.rol},
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.rol = result;
      let user: User = {
        userId: 0,
        username: this.username,
        rol: Rol.Otro
      };
      console.log(user);
      if (this.rol ="Desarrollador") {
        user.rol = Rol.Desarrollador;
      }
      this.apiService.addUser(user).subscribe(data => {
        this.user = data;
      }, error => {
        console.log(error);
      })
    });
    
  }
 
}
