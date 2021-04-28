import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PersonGroup } from 'src/app/models/person-group';
import { PersonGroupPerson } from 'src/app/models/person-group-person';
import { FaceService } from 'src/app/services/face.service';
import { ChangeNameComponent } from '../change-name/change-name.component';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.sass']
})
export class GroupPageComponent implements OnInit {

  constructor(
    private faceService:FaceService,
    private route:ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.groupId = params["groupId"];
      this.faceService.getPersonGroup(this.groupId).subscribe( (data) => this.personGroup = data );
      this.faceService.getPersonGroupPersonList(this.groupId).subscribe( (data) => this.personGroupPersons = data );;
    })
    
  }

  public groupId:string
  public personGroup: PersonGroup;
  public personGroupPersons: PersonGroupPerson[] = [];

  onChangeName(){

    const modalRef = this.modalService.open(ChangeNameComponent, {centered: true});
    modalRef.componentInstance.prevName = this.personGroup.name;
    modalRef.componentInstance.onSubmit.subscribe((name) => this.changeName(name));

  }

  changeName(name:string){
    this.faceService.patchPersonGroup(this.groupId, name).subscribe(()=>{
      this.personGroup.name = name;
    });
  }

}
