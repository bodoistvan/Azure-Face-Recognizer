import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceInfoComponent } from './components/face-info/face-info.component';
import { GroupPageComponent } from './components/group-page/group-page.component';
import { GroupsPageComponent } from './components/groups-page/groups-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { SettingPageComponent } from './components/setting-page/setting-page.component';

const routes: Routes = [
  { path: "face", component: FaceInfoComponent },
  { path: "settings", component: SettingPageComponent },
  { path: "groups", children: 
    [
      { path: ":groupId/persons/:personId", component: PersonPageComponent },
      { path: ":groupId", component: GroupPageComponent },
      { path: "", component: GroupsPageComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
