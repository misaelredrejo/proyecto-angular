import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Log } from '../shared/log.model';
import { Action } from '../shared/enums.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  logList: Log[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    console.log(Action[0])
    this.apiService.getLast10Logs().subscribe(data => {
      this.logList = data;
      console.log(data);
    }), error => {
      console.log(error);
    };

  }
 
}
