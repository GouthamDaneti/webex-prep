import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebexComponent } from './webex/webex.component';
import { RoomsComponent } from "./rooms/rooms.component";

@NgModule({
  declarations: [
    AppComponent,
    WebexComponent,
    RoomsComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
