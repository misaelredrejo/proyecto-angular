import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TitleService {

  // Observable string sources
  private titleSource = new Subject<string>();

  // Observable string streams
  title$ = this.titleSource.asObservable();

  // Service message commands
  changeTitle(title: string) {
    this.titleSource.next(title);
  }

}