import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataEnum } from 'src/app/models/dialog-data-enum.model';
import { Globals } from 'src/app/shared/globals';
import { FormControl } from '@angular/forms';
import { EnumItem } from 'src/app/models/enum-item.model';

@Component({
  selector: 'app-dialog-enum',
  templateUrl: './dialog-enum.component.html',
  styleUrls: ['./dialog-enum.component.css']
})
export class DialogEnumComponent implements OnInit {

  code: string;
  literaleses: {} = {};
  literaleseu: {} = {};
  enumItemList: EnumItem[] = [];
  filteredEnumItemList: EnumItem[] = [];
  enumFilter = new FormControl('');

  constructor(
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEnum
  ) {
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
  }

  ngOnInit(): void {
    this.code = this.data.codigo;
    for (var i = 0; i < this.data.enumList.length; i++) {
      let enumCode = this.code + '_' + this.data.enumList[i];
      let literales = this.literaleses[enumCode];
      let literaleu = this.literaleseu[enumCode];
      let enumItem: EnumItem = {
        code: enumCode,
        literales: literales,
        literaleu: literaleu,
        toString: enumCode+literales+literaleu
      }
      this.enumItemList.push(enumItem);
    }
    this.assignCopy();

    this.enumFilter.valueChanges
      .subscribe(
        enumLiteral => {
          this.filterEnum(enumLiteral);
        }
      );
  }

  assignCopy(): void {
    this.filteredEnumItemList = Object.assign([], this.enumItemList);
  }

  filterEnum(value):void {
    if(!value){
        this.assignCopy();
        return;
    } // when nothing has typed
    
    this.filteredEnumItemList = Object.assign([], this.enumItemList).filter(
       enumItem => enumItem.toString.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
 }

}
