import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {
  menu: any = [];
  literales: any = [];
  titulo: string = "Configuración NPR";
  appitemsInsert = [];

  appitems = [
  ];

  config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    fontColor: 'rgb(8, 54, 71)',
  };


  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    //this.titulo = localStorage.getItem("titulo");

    this.apiService
      .getJSON()
      .subscribe(
        data => {
          this.menu = data['menu'];
          this.literales = data['literales'];

          /* Rellenar menu */
          
          for (let key in this.menu['MenuItems']) {
            let value = this.menu['MenuItems'][key];
            let labelText = value['Link'] + ' - ' + this.literales[value['Link']];
            let title = labelText;
            labelText = (labelText.length > 30 ? labelText.substring(0, 30) + '...' : labelText);
            if (value['MenuItems']) {
              this.appitemsInsert.push({ label: labelText, items: this.getItem(value['MenuItems']) });
            } else {
              this.appitemsInsert.push({ label: labelText, link: "/content/" + value['Link'], titulo: title });
            }
          }
          this.appitems = this.appitemsInsert;
          

        },
        err => {
          console.log(err);
        }
      );



  }

  /*
  changeTitle(codigo: string, literal: string): void {
    this.titulo = codigo + " - " + literal;
    //localStorage.setItem("titulo", this.titulo);
  }*/


  

  selectedItem(item: any): void {
    this.titulo = item['titulo'];
  }

  
  getItem(menuItem: any): any {
    let items = [];
    for (let key in menuItem) {
      let value = menuItem[key];
      let labelText = value['Link'] + ' - ' + this.literales[value['Link']];
      let title = labelText;
      labelText = (labelText.length > 30 ? labelText.substring(0, 30) + '...' : labelText);
      if (value['MenuItems']) {
        items.push({ label: labelText, items: this.getItem(value['MenuItems']) });
      } else {
        items.push({ label: labelText, link: "/content/" + value['Link'], titulo: title });
      }
    }
    return items;
  }


}

