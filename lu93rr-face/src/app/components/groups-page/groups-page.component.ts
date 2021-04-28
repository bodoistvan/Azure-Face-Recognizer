import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonGroup } from 'src/app/models/person-group';
import { FaceService } from 'src/app/services/face.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.sass']
})
export class GroupsPageComponent implements OnInit {

  constructor(
    private faceService:FaceService
  ) { }

  ngOnInit(): void {
    this.personGroups = this.faceService.getPersonGroupList();
  }

  personGroups:Observable<PersonGroup[]>

  
  

}
