import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { TitleService } from '../shared/services/title.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { Rol, Status } from '../models/enums.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [TitleService]
})
export class NavComponent implements OnDestroy {
  menuProfesional: any[] = [];
  literaleses: string[] = [];
  user: User;
  title: string;
  value: string;
  rolTypes = Object.keys(Rol).map(k => Rol[k as any]);

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

    this.checkUser();
    this.loadJSON();
  }

  checkUser(): void {
    this.authService.currentUser.subscribe(data => {
      this.user = data;
      this.fillMenu();
    }, error => {
      console.log(error);
    });
  }

  loadJSON(): void {
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

  fillMenu(): void {
    this.appitemsInsert = [];
    this.menuProfesional.forEach((item) => {
      for (let key in item) {
        let value = item[key];
        let labelText = '';
        if (this.user && this.user.rol == Rol.Desarrollador) {
          labelText = key + ' - ' +this.literaleses[key]
        } else {
          labelText =  this.literaleses[key];
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
      if (this.user && this.user.rol == Rol.Desarrollador) {
        labelText = element + ' - ' + (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
      } else {
        labelText = (this.literaleses[element] ? this.literaleses[element] : this.literaleses[element.toLowerCase()]);
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

