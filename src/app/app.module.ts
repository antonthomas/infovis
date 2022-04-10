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

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    TopBarComponent,
    SurfaceComponent,
    BettingComponent,
    GeoComponent,
    RivalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
