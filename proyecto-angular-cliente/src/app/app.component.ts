import { Component, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  showSpinner: boolean;

  constructor(public spinnerService: SpinnerService, private cdRef:ChangeDetectorRef) { }

  ngOnInit() {

  }

  ngAfterViewChecked(){
    this.spinnerService.visibility.subscribe(data => {
      this.showSpinner = data;
    });
    this.cdRef.detectChanges();
  }
}
