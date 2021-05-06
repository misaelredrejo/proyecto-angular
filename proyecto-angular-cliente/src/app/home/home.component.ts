import { Component, OnInit, } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CommentLog } from '../models/commentlog.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogRolComponent } from './dialog-rol/dialog-rol.component';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Status } from '../models/enums.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  commentLogList: CommentLog[] = [];
  username: string;
  rolValue: number;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    let promise = new Promise<void>(async (resolve, reject) => {
      
    this.apiService.getLast10LogsAsync().subscribe(data => {
      console.log('log');
      switch (data.status) {
        case Status.Success:
          this.commentLogList = data.data;
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    });

    await this.apiService.getUserAsync().subscribe(data => {
      console.log('user')
      switch (data.status) {
        case Status.Success:
          this.user = data.data;
          this.authenticationService.login(this.user);
          break;
        case Status.NotFound:
          this.openDialogChooseUserRol();
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    });
    resolve();
    }).then(() => console.log("Task Completed!"));
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
      this.apiService.addUserAsync(user).subscribe(data => {
        switch (data.status) {
          case Status.Success:
            this.user = data.data;
            this.authenticationService.login(this.user);
            break;

          case Status.Error:
            console.log(data.message);
            break;
        }

      })
    });

  }

}
