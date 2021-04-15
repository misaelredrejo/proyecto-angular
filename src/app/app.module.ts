import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu/menu-item/menu-item.component';
import { ContentComponent } from './content/content.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { ToastrModule } from 'ngx-toastr';

import { MaterialModule } from './shared/material/material.module';


import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogCommentsComponent } from './content/dialog-comments/dialog-comments.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MenuComponent,
    MenuItemComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    DialogCommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
    FormsModule, ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
