import { Component, OnInit } from '@angular/core';
import { Globals } from '../shared/globals';
import { ModeloDF } from '../models/modelo-df.model';
import { FormControl } from '@angular/forms';
import { TitleService } from '../shared/services/title.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCommentsComponent } from '../content/dialog-comments/dialog-comments.component';
import { ApiService } from '../shared/services/api.service';
import { Status } from '../models/enums.model';


@Component({
  selector: 'app-content-modelos-df',
  templateUrl: './content-modelos-df.component.html',
  styleUrls: ['./content-modelos-df.component.css']
})
export class ContentModelosDFComponent implements OnInit {

  user: User;

  literaleses: {};
  literaleseu: {};
  searchControl = new FormControl('');
  options: string[] = [];
  filteredOptions: string[] = [];
  height: string = '200px';

  modelosDF: ModeloDF[] = [];
  filteredModelosDF: ModeloDF[] = [];
  origenesDF: {} = {};


  constructor(private globals: Globals, private titleService: TitleService, private route: ActivatedRoute, private authService: AuthenticationService, private spinnerService: SpinnerService, public dialog: MatDialog, private apiService: ApiService) {
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
    this.modelosDF = this.globals.modelosDF;
    this.origenesDF = this.globals.origenesDF;
    this.titleService.changeTitleToModelosDF();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
    }, error => {
      console.log(error);
    });

    this.modelosDF.forEach(modeloDF => {
      modeloDF.origenesDF = {};
    });
    for (let key in this.origenesDF) {
      let value = this.origenesDF[key];
      this.pushOrigenDFToModeloDFByModelo(value['modelo'], key, value);
    }

    //this.loadCntCommentsModeloFiltros();

    this.filteredModelosDF = this.modelosDF;
    this.options = this.modelosDF.map(modeloDF => <string>modeloDF.modelo);
    this.filteredOptions = this.options;

    this.searchControl.valueChanges.subscribe(
      value => {
        this.filteredOptions = this._filter(value);
        this.filterModelosDF(value);
        if (this.filteredOptions.length < 4) {
          this.height = (this.filteredOptions.length * 50) + 'px';
        } else {
          this.height = '200px'
        }
      }
    );
    this.route.queryParams.subscribe(params => {
      let origen = params['origen'];
      if (!origen) return;
      let modelo = '';
      if (this.origenesDF[origen]) { // Si es origen filtro por modelo.
        modelo = this.origenesDF[origen]['modelo'];
      } else { // Si no me han pasado el modelo para filtrar.
        modelo = origen;
      }
      this.searchControl.setValue(modelo);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filterModelosDF(value: string): void {
    this.filteredModelosDF = this.modelosDF.filter(modeloDF => modeloDF.modelo.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  pushOrigenDFToModeloDFByModelo(modelo: string, key: string, origenDF: {}): void {
    this.modelosDF.forEach(modeloDF => {
      if (modeloDF.modelo == modelo) {
        modeloDF.origenesDF[key] = origenDF;
        return;
      }
    });
  }

  /*loadCntCommentsModeloFiltros(): void {
    this.modelosDF.forEach(modeloDF => {
      
    });
  }*/

  openCommentsByPath(path: string): void {
    this.spinnerService.show();
    this.apiService.getCommentsByPathAsync(path).subscribe(data => {
      switch (data.status) {
        case Status.Success:
            this.dialog.open(DialogCommentsComponent, {
              width: '600px',
              data: { commentList: data.data, path: path }
            });
            this.spinnerService.hide();
          break;
        case Status.Error:
          console.log(data.message);
          this.spinnerService.hide();
          break;
      }
    }, error => {
      console.log(error);
      this.spinnerService.hide();
    });
  }

}