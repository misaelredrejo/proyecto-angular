import { Component, OnInit } from '@angular/core';
import { Globals } from '../shared/globals';
import { ModeloDF } from '../models/modelo-df.model';
import { FormControl } from '@angular/forms';
import { TitleService } from '../shared/services/title.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-content-modelos-df',
  templateUrl: './content-modelos-df.component.html',
  styleUrls: ['./content-modelos-df.component.css']
})
export class ContentModelosDFComponent implements OnInit {

  literaleses: {};
  literaleseu: {};
  displayedColumns: string[] = ['columnas', 'tiposColumnas'];
  dataSource = [];
  searchControl = new FormControl('');
  options: string[] = [];
  filteredOptions: string[] = [];
  height: string = '200px';

  modelosDF: ModeloDF[] = [];
  filteredModelosDF: ModeloDF[] = [];
  origenesDF: {} = {};


  constructor(private globals: Globals, private titleService: TitleService, private route: ActivatedRoute,) {
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
    this.modelosDF = this.globals.modelosDF;
    this.dataSource = this.modelosDF;
    this.origenesDF = this.globals.origenesDF;
    this.titleService.changeTitle('Modelos Datos Fiscales');
  }

  ngOnInit(): void {

    
    for (let key in this.origenesDF) {
      let value = this.origenesDF[key];
      this.pushOrigenDFtoModeloDFByModelo(value['modelo'], value);
    }

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
        let modelo = this.origenesDF[origen]['modelo'];
        this.searchControl.setValue(modelo);
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filterModelosDF(value: string): void {
    this.filteredModelosDF = this.modelosDF.filter( modeloDF => modeloDF.modelo.toLowerCase().indexOf(this.searchControl.value.toLowerCase()) !== -1);
  }

  pushOrigenDFtoModeloDFByModelo(modelo: string, origenDF: {}): void {
    this.modelosDF.forEach(modeloDF => {
      if (modeloDF.modelo == modelo) {
        modeloDF.origenDF = origenDF;
        return;
      }
    });
  }

}
