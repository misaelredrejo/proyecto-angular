import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass', './nav.component.css']
})
export class NavComponent implements OnDestroy {
  menu: any = [];
  literales: any = [];
  titulo: string = "Configuración NPR";
  appitemsInsert = [];

  appitems = [
    {
      label: 'Item 1 (with Font awesome icon)',
      faIcon: 'fab fa-500px',
      items: [
        {
          label: 'Item 1.1',
          link: '/content/13_AV',
          faIcon: 'fab fa-accusoft'
        },
        {
          label: 'Item 1.2',
          faIcon: 'fab fa-accessible-icon',
          items: [
            {
              label: 'Item 1.2.1',
              link: '/item-1-2-1',
              faIcon: 'fas fa-allergies'
            },
            {
              label: 'Item 1.2.2',
              faIcon: 'fas fa-ambulance',
              items: [
                {
                  label: 'Item 1.2.2.1',
                  link: 'item-1-2-2-1',
                  faIcon: 'fas fa-anchor'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      label: 'Item 2',
      icon: 'alarm',
      items: [
        {
          label: 'Item 2.1',
          link: '/item-2-1',
          icon: 'favorite'
        },
        {
          label: 'Item 2.2',
          link: '/item-2-2',
          icon: 'favorite_border'
        }
      ]
    },
    {
      label: 'Item 3',
      link: '/item-3',
      icon: 'offline_pin'
    },
    {
      label: 'Item 4',
      link: '/item-4',
      icon: 'star_rate',
      hidden: true
    }
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
          console.log(data);

          /* Rellenar menu */
          
          for (let key in this.menu['MenuItems']) {
            let value = this.menu['MenuItems'][key];
            let item = {label: value['Link'], titulo: value['Link'] + ' - ' + this.literales[value['Link']]  };

            if (value['MenuItems']) {
              item['items'] = [{label:'subnivel'}];
              let itemsSubnivel = [];
              for (let key1 in value['MenuItems']) {
                let value1 = value['MenuItems'][key1];
                itemsSubnivel.push({label: value1['Link'], link: "/content/"+value1['Link']})
              }
              item['items'] = itemsSubnivel;
              
            } else {
              item['link'] = "/content/"+value['Link'];
            }
            this.appitemsInsert.push(item);
          }
          /*
          for (let key in this.menu['MenuItems']) {
            let value = this.menu['MenuItems'][key];
            let item = {label: value['Link'], titulo: value['Link'] + ' - ' + this.literales[value['Link']]  };
            if (value['MenuItems']) {
              item['items'] = this.getItem(value['MenuItems']);
            } else {
              item['link'] = "/content/"+value['Link'];
            }
            this.appitemsInsert.push(item);
          }*/

          this.appitems = this.appitemsInsert;

        },
        err => {
          console.log(err);
        }
      );



  }

  changeTitle(codigo: string, literal: string): void {
    this.titulo = codigo + " - " + literal;
    //localStorage.setItem("titulo", this.titulo);
  }


  

  selectedItem(item: any): void {
    this.titulo = item['titulo'];
  }

  
  getItem(menuItem: any): any {

    if (menuItem['MenuItems']) {
      let items = [];
      for (let key in menuItem['MenuItems']) {
        let value = this.menu['MenuItems'][key];
        if (value['MenuItems']) {
          items.push(this.getItem(value['MenuItems']));
        }else {
          items.push({label: value['Link'], link: '/content/' + value['Link']});
        }
      }
      return items;
    } else {
      return {label: menuItem['Link'], link: '/content/' + menuItem['Link']};
    }



  }


}

