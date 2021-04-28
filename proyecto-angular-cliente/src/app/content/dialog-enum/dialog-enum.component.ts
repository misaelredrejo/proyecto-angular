import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  enumList: any[];
}

@Component({
  selector: 'app-dialog-enum',
  templateUrl: './dialog-enum.component.html',
  styleUrls: ['./dialog-enum.component.css']
})
export class DialogEnumComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  ngOnInit(): void {
  }

}
