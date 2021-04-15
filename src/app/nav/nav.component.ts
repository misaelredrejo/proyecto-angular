import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy {
  menuProfesional: any[] = [];
  menu: any = [];
  literaleses: any = [];
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
          this.menuProfesional = data['menuProfesional'];
          this.literaleses = data['literaleses'];
          this.menuProfesional.forEach((item) => {
            for (let key in item) {
              let value = item[key];
              let labelText = key + ' - ' + this.literaleses[key];
              let title = labelText;
              labelText = (labelText.length > 30 ? labelText.substring(0, 30) + '...' : labelText);
              if (value && value.length > 0) {
                
                let itemsMenu = [];
                value.forEach((element) => {
                  let labelText1 = element + ' - ' + (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
                  let title1 = labelText1;
                  labelText1 = (labelText1.length > 30 ? labelText1.substring(0, 30) + '...' : labelText1);
                  itemsMenu.push({ label: labelText1, link: "/content/" + element, titulo: title1 })
                });
                this.appitemsInsert.push({ label: labelText, items: itemsMenu, titulo: title });
              } else {
                this.appitemsInsert.push({ label: labelText, link: "/content/" + key, titulo: title });
              }
            }


          });
          this.appitems = this.appitemsInsert;


        },
        err => {
          console.log(err);
        }
      );



  }

  selectedItem(item: any): void {
    this.titulo = item['titulo'];

  }


/*
  getItem(menuItem: any): any {
    let items = [];
    for (let key in menuItem) {
      let value = menuItem[key];
      let labelText = value['Link'] + ' - ' + this.literaleses[value['Link']];
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
*/

}

