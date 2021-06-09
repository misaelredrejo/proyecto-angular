import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { TitleService } from '../shared/services/title.service';
import { Subscription, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Rol, Status } from '../models/enums.model';
import { Globals } from '../shared/globals';
import * as signalR from '@microsoft/signalr';
import { MenuItem } from '../models/menu-item.model';
import { FormControl } from '@angular/forms';
import { MultilevelNodes, Configuration, ExpandedRTL, ExpandedLTR } from 'ng-material-multilevel-menu';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [TitleService],
  animations: [ExpandedRTL, ExpandedLTR]
})
export class NavComponent implements OnDestroy {

  notifyUrl = "https://localhost:44361/notify";

  user: User;

  esquema: {} = {};
  menuProfesional: {}[] = [];
  literaleses: {} = {};
  options: string[] = [];
  filteredOptions: string[];
  height: string = '200px';

  title: string;
  searchControl = new FormControl('');
  rolTypes: string[] = Object.keys(Rol).map(k => Rol[k as any]);

  appitems: MenuItem[] = [
    { code: '0', literal: 'MENÚ', label: '0 - MENÚ', cntCommentsSubPath: 0 }
  ];

  config: Configuration = {
    interfaceWithRoute: true,
    customTemplate: true
  }


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
    this.menuProfesional = this.globals.menuProfesional;
    this.literaleses = this.globals.literaleses;
    this.esquema = this.globals.esquema;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.options = Object.keys(this.esquema);
    this.filteredOptions = this.options;

    this.searchControl.valueChanges.subscribe(
      value => {
        this.filteredOptions = this._filter(value);
        if (this.filteredOptions.length < 4) {
          this.height = (this.filteredOptions.length * 50) + 'px';
        } else {
          this.height = '200px'
        }
      }
    );

    this.fillMenu();
    this.checkUser();

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.notifyUrl)
      .build();

    connection.start().then(function () {
      // SignalR connected
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("BroadcastMessage", () => {
      this.updateMenu(this.appitems);
    });
  }

  checkUser(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      this.updateMenu(this.appitems);
    }, error => {
      console.log(error);
    });
  }

  fillMenu(): void {
    let appitemsInsert: MenuItem[] = [];
    this.menuProfesional.forEach((item) => {
      for (let key in item) {
        let value = item[key];
        let literales = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
        let menuItem: MenuItem = { code: key, literal: literales, label: key + ' - ' + literales, cntCommentsSubPath: 0 };
        this.getCntCommentsSubPath(key).then(data => menuItem.cntCommentsSubPath = data);
        if (value && value.length > 0) { // Si tiene subniveles
          menuItem.items = this.itemsSubMenu(value);
          appitemsInsert.push(menuItem);
        } else {
          menuItem.link = "/content/" + key;
          appitemsInsert.push(menuItem);
        }
      }
    });
    this.appitems = appitemsInsert;
  }

  itemsSubMenu(items: string[]): MenuItem[] {
    let itemsSubMenu: MenuItem[] = [];
    items.forEach((key) => {
      let literales = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
      let menuItem: MenuItem = { code: key, literal: literales, label: key + ' - ' + literales, link: "/content/" + key, cntCommentsSubPath: 0 };
      this.getCntCommentsSubPath(key).then(data => menuItem.cntCommentsSubPath = data);
      itemsSubMenu.push(menuItem);
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

  updateMenu(menuItems: MenuItem[]): void {
    if (!menuItems || menuItems.length == 0) return;
    menuItems.forEach(menuItem => {
      if (menuItem.items && menuItem.items.length > 0) this.updateMenu(menuItem.items);
      this.getPathHasUnreadLogsForUser(this.user.userId, menuItem.code).then(res => {
        if (res) menuItem.icon = 'notification_important';
        else menuItem.icon = '';
      });
      this.getCntCommentsSubPath(menuItem.code).then(data => menuItem.cntCommentsSubPath = data);
      if (this.user && this.user.rol == Rol.Desarrollador) {
        menuItem.label = menuItem.code + ' - ' + menuItem.literal;
      } else menuItem.label = menuItem.literal;
    });
  }

  resetTitle(): void {
    this.titleService.resetTitle();
  }

  async getPathHasUnreadLogsForUser(userId: number, path: string): Promise<boolean> {
    let pathHasUnreadLogs = false;
    await this.apiService.getPathHasUnreadLogsForUserAsync(userId, path).toPromise().then(data => {
      switch (data.status) {
        case Status.Success:
          pathHasUnreadLogs = data.data;
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    }).catch(error => console.log(error));
    return pathHasUnreadLogs;
  }

  async getCntCommentsSubPath(path: string): Promise<number> {
    let cntCommentsSubPath: number = 0;
    await this.apiService.getCntCommentsSubPathAsync(path).toPromise().then(data => {
      switch (data.status) {
        case Status.Success:
          cntCommentsSubPath = data.data;
          break;
        case Status.Error:
          console.log(data.message);
          break;
      }
    }).catch(error => console.log(error));;
    return cntCommentsSubPath;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getClass(item) {
    return {
      [item.faIcon]: true
    }
  }

}