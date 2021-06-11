import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TitleService {

  private defaultTitle = 'Configuración NPR';
  private modelosDFTitle = 'Modelos Datos Fiscales';

  // Observable string sources
  private titleSource: BehaviorSubject<string>;
  public title$: Observable<string>;

  constructor() {
    this.titleSource = new BehaviorSubject<string>(this.defaultTitle);
    // Observable string streams
    this.title$ = this.titleSource.asObservable()
  }

  // Service message commands
  changeTitle(title: string): void {
    this.titleSource.next(title);
  }

  changeTitleFromContent(title: string): void {
    let currentTitle = this.currentTitleValue;
    if (currentTitle != this.defaultTitle && currentTitle != this.modelosDFTitle) {
      this.titleSource.next(title);
    }
  }

  changeTitleToModelosDF(): void {
    this.titleSource.next(this.modelosDFTitle);
  }

  resetTitle(): void {
    this.titleSource.next(this.defaultTitle);
  }

  public get currentTitleValue(): string {
    return this.titleSource.getValue();
  }

}