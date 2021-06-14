import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../shared/services/spinner.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.hide();
  }

}
