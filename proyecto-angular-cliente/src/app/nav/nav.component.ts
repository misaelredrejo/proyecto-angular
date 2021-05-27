import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { TitleService } from '../shared/services/title.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Rol, Status } from '../models/enums.model';
import { Globals } from '../shared/globals';
import * as signalR from '@microsoft/signalr';
import { MenuItem } from '../models/menu-item.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [TitleService]
})
export class NavComponent implements OnDestroy {

  notifyUrl = "https://localhost:44361/notify";

  user: User;

  menuProfesional: {}[] = [];
  literaleses: {} = {};

  title: string;
  value: string;
  rolTypes: string[] = Object.keys(Rol).map(k => Rol[k as any]);

  appitemsInsert: MenuItem[] = [];
  appitems: MenuItem[] = [
    { code: '0', literal: 'MENÚ', label: '0 - MENÚ' }
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
    this.menuProfesional = this.globals.menuProfesional;
    this.literaleses = this.globals.literaleses;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.checkUser();

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.notifyUrl)
      .build();

    connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("BroadcastMessage", () => {
      console.log('BroadcastMessage!');
    });

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
          labelText = literales;
        }
        let menuItem: MenuItem = {code: key, literal: literales, label: labelText};
        this.getPathHasUnreadLogsForUser(this.user.userId, key).then(res => {
          if (res) menuItem.icon = 'info';
        });
        if (value && value.length > 0) { // Si tiene subniveles
          menuItem.items = this.itemsSubMenu(value);
          this.appitemsInsert.push(menuItem);
        } else {
          menuItem.link = "/content/" + key;
          this.appitemsInsert.push(menuItem);
        }
      }
    });
    this.appitems = this.appitemsInsert;
  }

  itemsSubMenu(items: string[]): MenuItem[] {
    let itemsSubMenu: MenuItem[] = [];
    items.forEach((key) => {
      let labelText = '';
      let literales = (this.literaleses[key] ? this.literaleses[key] : this.literaleses[key.toLowerCase()]);
      if (this.user && this.user.rol == Rol.Desarrollador) {
        labelText = key + ' - ' + literales;
      } else {
        labelText = literales;
      }
      let menuItem: MenuItem = {code: key, literal: literales, label: labelText, link: "/content/" + key};
      this.getPathHasUnreadLogsForUser(this.user.userId, key).then(res =>{
        if (res) menuItem.icon = 'info';
      });
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

  updateMenu(): void { //TODO Actualizar iconos al recibir broadcast
    if (!this.appitems) return;
    this.appitems.forEach(menuItem => {
      
    });
  }

  resetTitle(): void {
    this.titleService.resetTitle();
  }

  async getPathHasUnreadLogsForUser(userId: number, path: string): Promise<boolean> {
    let pathHasUnreadLogs = false;
    await this.apiService.getPathHasUnreadLogsForUserAsync(this.user.userId, path).toPromise().then(data => {
      switch (data.status) {
        case Status.Success:
          pathHasUnreadLogs = data.data;
          break;
      
        case Status.Error:
          console.log(data.message);
          break;
      }
    }, error => {
      console.log(error);
    });
    return pathHasUnreadLogs;
  }

}

