import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FaceInfoComponent } from './components/face-info/face-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaceChooserComponent } from './components/face-chooser/face-chooser.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SettingPageComponent } from './components/setting-page/setting-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsPageComponent } from './components/groups-page/groups-page.component';
import { GroupPageComponent } from './components/group-page/group-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { ChangeNameComponent } from './components/change-name/change-name.component';
import { NavComponent } from './components/nav/nav.component';
import { YouSureComponent } from './components/you-sure/you-sure.component';
import { GroupNavComponent } from './components/group-nav/group-nav.component';
import { ToastsContainerComponent } from './components/toasts-container/toasts-container.component';


@NgModule({
  declarations: [
    AppComponent,
    FaceInfoComponent,
    FaceChooserComponent,
    SettingPageComponent,
    GroupsPageComponent,
    GroupPageComponent,
    PersonPageComponent,
    ChangeNameComponent,
    NavComponent,
    YouSureComponent,
    GroupNavComponent,
    ToastsContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    NgbModule,
    AngularResizedEventModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
