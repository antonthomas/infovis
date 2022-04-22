import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { SurfaceComponent } from './components/surface/surface.component';
import { BettingComponent } from './components/betting/betting.component';
import { GeoComponent } from './components/geo/geo.component';
import { RivalComponent } from './components/rival/rival.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { HttpClientModule } from '@angular/common/http';
import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig,
} from 'ng-gapi';

const gapiClientConfig: NgGapiClientConfig = {
  client_id:
    '807145211401-men3dcoe5ou4kvsp3j7d0ehgcipc1jef.apps.googleusercontent.com', // your client ID
  discoveryDocs: [
    'https://content.googleapis.com/discovery/v1/apis/bigquery/v2/rest',
  ],
  scope: 'https://www.googleapis.com/auth/bigquery.readonly',
};

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    TopBarComponent,
    SurfaceComponent,
    BettingComponent,
    GeoComponent,
    RivalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    AngularResizeEventModule,
    HttpClientModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
