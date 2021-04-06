import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.sass']
})
export class MenuItemComponent implements OnInit {
  @Input() items: string; //@Input() items: any[];
  @ViewChild('childMenu', {static: true}) public childMenu: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
