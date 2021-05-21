import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { TitleService } from '../shared/services/title.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Rol, Status } from '../models/enums.model';
import { Globals } from '../shared/globals';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [TitleService]
})
export class NavComponent implements OnDestroy {
  user: User;
  
  menuProfesional: {}[] = [];
  literaleses: {} = {};

  title: string;
  value: string;
  rolTypes: string[] = Object.keys(Rol).map(k => Rol[k as any]);

  appitemsInsert = [];
  appitems = [
    {label: 'MENÚ'}
  ];

  config = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    fontColor: 'rgb(8, 54, 71)',
  };


  mobileQuery: MediaQueryList;
  
  subscription: Subscription;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private globals: Globals, private apiService: ApiService, private titleService: TitleService, private authService: AuthenticationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = titleService.title$.subscribe(
      title => {
        this.title = title;
    });
    this.menuProfesional = globals.menuProfesional;
    this.literaleses = globals.literaleses;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.checkUser();
  }

  checkUser(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
      this.fillMenu();
    }, error => {
      console.log(error);
    });
  }

  fillMenu(): void {
    this.appitemsInsert = [];
    this.menuProfesional.forEach((item) => {
      for (let key in item) {
        let value = item[key];
        let labelText = '';
        let literales = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
        if (this.user && this.user.rol == Rol.Desarrollador) {
          labelText = key + ' - ' + literales;
        } else {
          labelText =  literales;
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
      let labelText = '';
      let literales = (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
      if (this.user && this.user.rol == Rol.Desarrollador) {
        labelText = element + ' - ' + literales;
      } else {
        labelText = literales;
      }
      itemsSubMenu.push({ label: labelText, link: "/content/" + element});
    });
    return itemsSubMenu;
  }

  changeRol(rol: string): void {
    if (!this.user) return;
    this.user.rol = Rol[rol];
    this.apiService.updateUserAsync(this.user.userId, this.user).subscribe(data => {
      switch (data.status) {
        case Status.Success:
          this.user = data.data;
          this.authService.login(this.user);
          break;
        case Status.NotFound:
          console.log(data.message);
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    }, error => {
      console.log(error);
    });
  }

  resetTitle(): void {
    this.titleService.resetTitle();
  }

}

