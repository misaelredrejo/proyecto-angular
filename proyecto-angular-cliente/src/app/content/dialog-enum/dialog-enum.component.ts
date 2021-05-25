import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogDataEnum } from 'src/app/models/dialog-data-enum.model';
import { Globals } from 'src/app/shared/globals';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-dialog-enum',
  templateUrl: './dialog-enum.component.html',
  styleUrls: ['./dialog-enum.component.css']
})
export class DialogEnumComponent implements OnInit {

  literaleses: {} = {};
  literaleseu: {} = {};
  enumLiteralList: string[] = [];
  filteredEnumLiteralList: string[] = [];
  enumFilter = new FormControl('');

  constructor(
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEnum
  ) {
    this.literaleses = this.globals.literaleses;
    this.literaleseu = this.globals.literaleseu;
  }

  ngOnInit(): void {
    for (var i = 0; i < this.data.enumList.length; i++) {
      let codigo = this.data.codigo + '_' + this.data.enumList[i];
      let literalEs = this.literaleses[codigo];
      let literalEu = this.literaleseu[codigo];
      this.enumLiteralList.push(codigo + ' - ' + literalEs + ' - ' + literalEu);
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
    this.filteredEnumLiteralList = Object.assign([], this.enumLiteralList);
  }

  filterEnum(value):void {
    console.log(value)
    if(!value){
        this.assignCopy();
        return;
    } // when nothing has typed
    
    this.filteredEnumLiteralList = Object.assign([], this.enumLiteralList).filter(
       enumLiteral => enumLiteral.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
 }

}
