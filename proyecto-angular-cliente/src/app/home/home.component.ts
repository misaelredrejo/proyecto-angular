import { Component, OnInit, ViewChild, } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CommentLog } from '../models/commentlog.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogRolComponent } from './dialog-rol/dialog-rol.component';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Status, Action } from '../models/enums.model';
import { SpinnerService } from '../shared/services/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterQuery } from '../models/filter-query.model';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../shared/globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  literaleses: {} = {};
  literaleseu: {} = {};
  user: User;
  commentLogList: CommentLog[] = [];
  username: string;
  rolValue: number;

  displayedColumns = ['username', 'action', 'date', 'path'];
  displayedColumnsForm = ['usernameForm', 'actionForm', 'rangeDateForm'];//, 'literalForm'
  dataSource: MatTableDataSource<CommentLog>;
  dataSourceLast2Weeks: MatTableDataSource<CommentLog>;

  formBackendFilter: FormGroup;
  activeUserList: User[] = [];

  usernameFilter = new FormControl('');
  actionFilter = new FormControl('');
  actionList: string[] = ['Añadir', 'Modificar', 'Eliminar', 'Activar'];
  startDateFilter = new FormControl('');
  endDateFilter = new FormControl('');
  literalFilter = new FormControl('');
  filterValues = {
    username: '',
    action: [],
    startDate: new Date(-8640000000000000),
    endDate: new Date(),
    literal: ''
  };
  maxDate: Date;
  ActionType = Action;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private globals: Globals,
    private apiService: ApiService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private toastrService: ToastrService,

  ) {
    let date2WeeksAgo = new Date();
    date2WeeksAgo.setDate(date2WeeksAgo.getDate() - 14);
    this.maxDate = new Date();
    this.formBackendFilter = this.fb.group({
      username: [''],
      action: [''],
      startDate: [date2WeeksAgo, Validators.required],
      endDate: [new Date(), Validators.required]
    });

    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
  }


  ngOnInit(): void {
    this.apiService.getActiveUsersAsync().subscribe(data => {
      switch (data.status) {
        case Status.Success:
          this.activeUserList = data.data;
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    }, error => {
      console.log(error);
    });

    this.spinnerService.show();

    let p0 = this.apiService.getLast10CommentLogsAsync().toPromise();
    let p1 = this.apiService.getLast2WeeksCommentLogsAsync().toPromise();
    let p2 = this.apiService.getUserAsync().toPromise();

    Promise.all([p0, p1, p2]).then(res => {
      if (res[0].status == Status.Success) {
        this.dataSourceLast2Weeks = new MatTableDataSource(res[0].data);
      } else {
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

    this.frontFiltersValueChanges();

  }

  frontFiltersValueChanges(): void {
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
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.startDateFilter.valueChanges
      .subscribe(
        startDate => {
          this.filterValues.startDate = startDate ? startDate : new Date(-8640000000000000);
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
    this.endDateFilter.valueChanges
      .subscribe(
        endDate => {
          endDate = endDate ? endDate : new Date();
          endDate.setHours(23);
          endDate.setMinutes(59);
          endDate.setSeconds(59);
          this.filterValues.endDate = endDate;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      );
      this.literalFilter.valueChanges
      .subscribe(
        literal => {
          this.filterValues.literal = literal;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      let containsAction = false;
      searchTerms.action.forEach(action => {
        action = (action == "Añadir" ? "Aniadir" : action);
        if (Action[data.action] == action) containsAction = true;
      });
      if (searchTerms.action == null || searchTerms.action.length == 0) containsAction = true;
      let path: string = data.path;
      let pathArray = path.split('/');
      let code = pathArray[pathArray.length-1];
      //let literal = this.literaleses[code] ? this.literaleses[code] : this.literaleses[code.toLowerCase()];
    
      return data.username.toLowerCase().indexOf(searchTerms.username.toLowerCase()) !== -1 &&
        containsAction &&
        data.date >= searchTerms.startDate &&
        data.date <= searchTerms.endDate 
        ;// && literal.toLowerCase().indexOf(searchTerms.literal.toLowerCase()) !== -1
        
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
      },
      error => {
        console.log(error);
      });
    });
  }

  filterTable() {
    if (this.formBackendFilter.valid) {
      let username: string = this.formBackendFilter.get('username').value;
      let actionStr: string = this.formBackendFilter.get('action').value
      let startDate: Date = this.formBackendFilter.get('startDate').value;
      let endDate: Date = this.formBackendFilter.get('endDate').value;
      let action: Action;
      let filterQuery: FilterQuery = {
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString()
      }
      if (actionStr) {
        switch (actionStr) {
          case 'Añadir':
            action = Action.Aniadir;
            break;
          case 'Modificar':
            action = Action.Modificar;
            break;
          case 'Eliminar':
            action = Action.Eliminar;
            break;
          case 'Activar':
            action = Action.Activar;
            break;
        }
        filterQuery.action = action;
      }
      if (username) filterQuery.username = username;

      this.apiService.getCommentLogsByFilter(filterQuery).subscribe(data => {
        switch (data.status) {
          case Status.Success:
            this.dataSource = new MatTableDataSource(data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = this.createFilter();
            this.startDateFilter.reset();
            this.endDateFilter.reset();
            this.toastrService.success('Datos actualizados correctamente.', 'Actualizar tabla');
            break;
          case Status.Error:
            this.toastrService.error(data.message, 'ERROR');
            break;
        }
      });
    } else {
      this.toastrService.error('Formulario inválido, por favor revise los datos.', 'ERROR');
    }

  }

  resetForm(): void {
    let date2WeeksAgo = new Date();
    date2WeeksAgo.setDate(date2WeeksAgo.getDate() - 14);
    this.formBackendFilter = this.fb.group({
      username: [''],
      action: [''],
      startDate: [date2WeeksAgo, Validators.required],
      endDate: [new Date(), Validators.required]
    });
  }

}
