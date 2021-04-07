import { Component } from '@angular/core';
import { ApiService } from './shared/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  jsonObject: any[] = [];
  menu: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {

    this.apiService
      .getJSON()
      .subscribe(
        data => {
          this.jsonObject = data;
          this.menu = this.jsonObject['menu'];
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
  }
}
