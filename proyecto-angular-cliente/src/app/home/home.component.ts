import { Component, OnInit, ViewChild, } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CommentLog } from '../models/commentlog.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogRolComponent } from './dialog-rol/dialog-rol.component';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Status } from '../models/enums.model';
import { SpinnerService } from '../shared/services/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  literaleses: string[] = [];
  literaleseu: string[] = [];
  user: User;
  commentLogList: CommentLog[] = [];
  username: string;
  rolValue: number;

  displayedColumns = ['username', 'action', 'date', 'path'];
  dataSource: MatTableDataSource<CommentLog>;
  dataSourceLast10: MatTableDataSource<CommentLog>;

  usernameFilter = new FormControl('');
  actionFilter = new FormControl('');
  actionList: string[] = ['Añadir', 'Editar', 'Borrar', 'Activar'];
  filterValues = {
    username: '',
    action: -1,
  };

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private spinnerService: SpinnerService
  ) { 
  }

  
  ngOnInit(): void {

    this.apiService.getJSONAsync().subscribe(data => {
      this.literaleses = data['literaleses'];
      this.literaleseu = data['literaleseu'];
    }, error => {
      console.log(error);
    });

    this.spinnerService.show();

    let p0 = this.apiService.getLast10CommentLogsAsync().toPromise();
    let p1 = this.apiService.getCommentLogsAsync().toPromise();
    let p2 = this.apiService.getUserAsync().toPromise();

    Promise.all([p0, p1, p2]).then(res => {
      if (res[0].status == Status.Success) {
        this.dataSourceLast10 = new MatTableDataSource(res[0].data);
      }else {
        console.log(res[0].message);
      }
      if (res[1].status == Status.Success) {
        this.dataSource = new MatTableDataSource(res[1].data);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
      }
      else {
        console.log(res[1].message);
      }
      if (res[2].status == Status.Success) {
        this.user = res[2].data;
        this.authenticationService.login(this.user);
      } else if (res[2].status == Status.NotFound) {
        this.openDialogChooseUserRol();
      } else {
        console.log(res[1].message);
      }

      this.spinnerService.hide();
    }).catch(e => {
      console.log(e);
      this.spinnerService.hide();
    });

    this.usernameFilter.valueChanges
      .subscribe(
        username => {
          this.filterValues.username = username;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    );
    this.actionFilter.valueChanges
      .subscribe(
        action => {
          this.filterValues.action = action;
          console.log(action);
          //this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    );


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.username.toLowerCase().indexOf(searchTerms.username.toLowerCase()) !== -1
    }
    return filterFunction;
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
