import { environment } from '@env/environment';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
registerLocaleData(localeCs);

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NbThemeModule, NbLayoutModule, NbWindowModule, NbDatepickerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './core/services/auth.service';
import { httpInterceptorProviders } from './core/http-interceptors';
import { HttpErrorService } from './core/services/http-error.service';

import { AppComponent } from './app.component';
import { MasterHeaderComponent } from './core/components/master-header/master-header.component';
import { MasterFooterComponent } from './core/components/master-footer/master-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterHeaderComponent,
    MasterFooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    NbThemeModule.forRoot({ name: 'tbdi' }),
    NbWindowModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule
  ],
  providers: [
    httpInterceptorProviders,
    AuthService,
    HttpErrorService,
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CZK' },
    { provide: LOCALE_ID, useValue: 'cs'}
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
