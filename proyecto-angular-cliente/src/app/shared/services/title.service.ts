import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TitleService {

  private defaultTitle = 'Configuración NPR';

  // Observable string sources
  private titleSource: BehaviorSubject<string>;
  public title$: Observable<string>;

  constructor() {
    this.titleSource = new BehaviorSubject<string>(this.defaultTitle);
    // Observable string streams
    this.title$ = this.titleSource.asObservable()
  }

  // Service message commands
  changeTitle(title: string) {
    this.titleSource.next(title);
  }

  resetTitle() {
    this.titleSource.next(this.defaultTitle);
  }

  public get currentTitleValue(): string {
    return this.titleSource.getValue();
  }

}