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
  literaleses: any = [];
  titulo: string = "Configuración NPR";
  user: string = "";

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
    /*
    this.apiService.getUser().subscribe(data => {
      this.user = data;
    }, error => {
      console.log(error);
    })
*/
    this.apiService
      .getJSON()
      .subscribe(
        data => {
          this.menuProfesional = data['menuProfesional'];
          this.literaleses = data['literaleses'];
          this.fillMenu();

        },
        err => {
          console.log(err);
        }
      );

  }

  fillMenu() {
    this.menuProfesional.forEach((item) => {
      for (let key in item) {
        let value = item[key];
        let labelText = key + ' - ' + this.literaleses[key];
        let title = labelText;
        labelText = (labelText.length > 30 ? labelText.substring(0, 30) + '...' : labelText);

        if (value && value.length > 0) { // Si tiene subniveles
          this.appitemsInsert.push({ label: labelText, items: this.itemsSubMenu(value), titulo: title });
        } else {
          this.appitemsInsert.push({ label: labelText, link: "/content/" + key, titulo: title });
        }
      }
    });
    this.appitems = this.appitemsInsert;
  }

  itemsSubMenu(items: string[]): any[] {
    let itemsSubMenu = [];
    items.forEach((element) => {
      let labelText = element + ' - ' + (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
      let title1 = labelText;
      labelText = (labelText.length > 30 ? labelText.substring(0, 30) + '...' : labelText);
      itemsSubMenu.push({ label: labelText, link: "/content/" + element, titulo: title1 })
    });
    return itemsSubMenu
  }

  selectedItem(item: any): void {
    this.titulo = item['titulo'];

  }

}

