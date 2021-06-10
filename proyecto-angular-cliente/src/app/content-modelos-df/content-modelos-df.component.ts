import { Component, OnInit } from '@angular/core';
import { Globals } from '../shared/globals';
import { ModeloDF } from '../models/modelo-df.model';
import { FormControl } from '@angular/forms';
import { TitleService } from '../shared/services/title.service';


@Component({
  selector: 'app-content-modelos-df',
  templateUrl: './content-modelos-df.component.html',
  styleUrls: ['./content-modelos-df.component.css']
})
export class ContentModelosDFComponent implements OnInit {

  displayedColumns: string[] = ['columnas', 'tiposColumnas'];
  dataSource = [];
  searchControl = new FormControl('');
  options: string[] = [];
  filteredOptions: string[] = [];
  height: string = '200px';

  modelosDF: ModeloDF[] = [];
  filteredModelosDF: ModeloDF[] = [];

  constructor(globals: Globals, private titleService: TitleService) { 
    this.modelosDF = globals.modelosDF;
    this.dataSource = this.modelosDF;
    this.titleService.changeTitle('Modelos Datos Fiscales');
  }

  ngOnInit(): void {
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
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  filterModelosDF(value: string): void {
    this.filteredModelosDF = this.modelosDF.filter( modeloDF => modeloDF.modelo.toLowerCase().indexOf(this.searchControl.value.toLowerCase()) !== -1);
  }

}
