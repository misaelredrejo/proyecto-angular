import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  jsonObject: any = [];
  menu: any = [];
  literales: any = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {


    this.apiService
      .getJSON()
      .subscribe(
        data => {
          this.jsonObject = data;
          this.menu = this.jsonObject['menu'];
          this.literales = this.jsonObject['literales'];
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
  }

}
