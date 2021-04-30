import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavComponent } from './nav/nav.component';
import { ContentComponent } from './content/content.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { ToastrModule } from 'ngx-toastr';

import { MaterialModule } from './shared/material.module';


import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogCommentsComponent } from './content/dialog-comments/dialog-comments.component';
import { WinAuthInterceptor } from './shared/winauth-interceptor';
import { DialogRolComponent } from './home/dialog-rol/dialog-rol.component';
import { DialogEnumComponent } from './content/dialog-enum/dialog-enum.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    DialogCommentsComponent,
    DialogRolComponent,
    DialogEnumComponent,
    NotFoundComponent
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
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: WinAuthInterceptor,
    multi: true
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
