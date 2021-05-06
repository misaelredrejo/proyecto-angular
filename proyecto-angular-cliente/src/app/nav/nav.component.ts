import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { TitleService } from '../shared/services/title.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Rol } from '../models/enums.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [TitleService]
})
export class NavComponent implements OnDestroy {
  menuProfesional: any[] = [];
  literaleses: any[] = [];
  user: User;
  title: string = "Configuración NPR";
  value: string;

  appitemsInsert = [];
  appitems = [
  ];

  config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    fontColor: 'rgb(8, 54, 71)',
  };


  mobileQuery: MediaQueryList;

  
  subscription: Subscription;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService, private titleService: TitleService, private authService: AuthenticationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = titleService.title$.subscribe(
      title => {
        this.title = title;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    this.apiService
      .getJSONAsync()
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
        let labelText = '';
        if (this.user && this.user.rol == Rol.Desarrollador) {
          labelText =  this.literaleses[key];
        } else {
        labelText = key + ' - ' +this.literaleses[key]
        }

        if (value && value.length > 0) { // Si tiene subniveles
          this.appitemsInsert.push({ label: labelText, items: this.itemsSubMenu(value)});
        } else {
          this.appitemsInsert.push({ label: labelText, link: "/content/" + key});
        }
      }
    });
    this.appitems = this.appitemsInsert;
  }

  itemsSubMenu(items: string[]): any[] {
    let itemsSubMenu = [];
    items.forEach((element) => {
      let labelText = element + ' - ' + (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
      itemsSubMenu.push({ label: labelText, link: "/content/" + element})
    });
    return itemsSubMenu
  }



}

