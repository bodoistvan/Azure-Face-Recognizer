import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceInfoComponent } from './components/face-info/face-info.component';

const routes: Routes = [
  {path: "face", component: FaceInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
