import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FaceService } from './face.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  /**
   * Röviden: Semmilyen már oldal nem látogatható amíg nincs valamilyen API key beállítva. 
   */

  constructor(private router:Router, private faceService:FaceService) { }
  canActivate(): boolean {
    if (this.faceService.isApiConditionsLoaded() == false){
      this.router.navigate(['settings']);
      return false;
    }
    return true;
  }
}
