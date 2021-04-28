import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PersonGroupPerson } from 'src/app/models/person-group-person';
import { FaceService } from 'src/app/services/face.service';

@Component({
  selector: 'app-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.sass']
})
export class PersonPageComponent implements OnInit {

  constructor(
    private faceService: FaceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params["groupId"];
      const personId = params["personId"];
      this.faceService.getPersonGroupPerson(groupId, personId).subscribe(person => this.person = person);
    })
    
  }

  person: PersonGroupPerson;

}
