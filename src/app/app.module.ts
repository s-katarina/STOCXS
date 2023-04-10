import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { MaterialModule } from './material/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabelsComponent } from './tabels/tabels.component'; 
import { HttpClientModule } from '@angular/common/http';
import { GraphComponent } from './graph/graph.component';
import { CanvasJSChart } from 'assets/canvasjs.angular.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TabelsComponent,
    GraphComponent,
    CanvasJSChart
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule, 
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
