import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceInfoComponent } from './components/face-info/face-info.component';
import { GroupPageComponent } from './components/group-page/group-page.component';
import { GroupsPageComponent } from './components/groups-page/groups-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { SettingPageComponent } from './components/setting-page/setting-page.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service'

const routes: Routes = [
  {path: "", redirectTo:"face", pathMatch: 'full' },
  { path: "face", component: FaceInfoComponent, canActivate: [AuthGuard] },
  { path: "settings", component: SettingPageComponent },
  { path: "groups", canActivate: [AuthGuard], children: 
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
