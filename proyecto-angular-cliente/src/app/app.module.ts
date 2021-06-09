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
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { DatabaseComponent } from './error/database/database.component';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/custom-date-adapter';
import { Globals } from './shared/globals';
import { LimitPipe } from './shared/pipes/limit.pipe';
import { LimitArrayPipe } from './shared/pipes/limit-array.pipe';
import { ContentModelosDFComponent } from './content-modelos-df/content-modelos-df.component';
import { FlexLayoutModule } from '@angular/flex-layout';


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
    NotFoundComponent,
    ErrorComponent,
    DatabaseComponent,
    LimitPipe, LimitArrayPipe, ContentModelosDFComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule

  ],
  exports: [LimitPipe, LimitArrayPipe],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: WinAuthInterceptor,
    multi: true,
  },
    Globals,
  { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  { provide: DateAdapter, useClass: CustomDateAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule { }
