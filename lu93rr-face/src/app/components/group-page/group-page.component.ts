import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { PersonGroup } from 'src/app/models/person-group';
import { PersonGroupPerson } from 'src/app/models/person-group-person';
import { TrainStatus } from 'src/app/models/train-status';
import { FaceService } from 'src/app/services/face.service';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { YouSureComponent } from '../you-sure/you-sure.component';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.sass']
})
export class GroupPageComponent implements OnInit {

  constructor(
    private faceService:FaceService,
    private route:ActivatedRoute,
    private modalService: NgbModal,
    private fb:FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.groupId = params["groupId"];
      this.faceService.getPersonGroup(this.groupId).subscribe( (data) => this.personGroup = data );
      this.faceService.getPersonGroupPersonList(this.groupId).subscribe( (data) => this.personGroupPersons = this.sortByName(data) );;
      this.faceService.getPersonGroupTrainStatus(this.groupId).subscribe( data => this.trainInfo = data);
    })
    
  }

  public groupId:string
  public personGroup: PersonGroup;
  public personGroupPersons: PersonGroupPerson[] = [];
  public trainInfo:TrainStatus;

  onChangeName(){
    const modalRef = this.modalService.open(ChangeNameComponent, {centered: true});
    modalRef.componentInstance.prevName = this.personGroup.name;
    modalRef.componentInstance.onSubmit.subscribe((name) => this.changeName(name));
  }

  onTrain(){
    this.faceService.postPersonGroupTrain(this.groupId).subscribe(()=>{
      setTimeout(()=> this.faceService.getPersonGroupTrainStatus(this.groupId).subscribe(data => this.trainInfo = data), 1000)
    })
  }

  changeName(name:string){
    this.faceService.patchPersonGroup(this.groupId, name).subscribe(()=>{
      this.personGroup.name = name;
    });
  }

  onDelete(){}

  newPersonForm = this.fb.control([], Validators.required);

  sortByName(array:PersonGroupPerson[]){
    return array.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))
  }

  onNewPersonSubmit(){
    this.newPersonForm.markAsTouched();

    if (this.newPersonForm.valid == true){
      const name = this.newPersonForm.value;
      this.faceService.postPersonGroupPersonCreate(this.groupId, name).subscribe((res) => {
        const person:PersonGroupPerson = {name: name, personId : res.personId, persistedFaceIds: []};  
        this.personGroupPersons.push(person);
        this.personGroupPersons = this.sortByName(this.personGroupPersons);

        this.newPersonForm.reset();
      
        this.newPersonForm.markAsUntouched();
      });
    }
  }

  onGroupDelete(){
    const modalRef = this.modalService.open(YouSureComponent, {centered: true});
    modalRef.componentInstance.text = "Are you sure you wante to delete group: "+ this.personGroup.name;
    modalRef.componentInstance.onSubmit.subscribe(() => this.groupDelete());
  }

  groupDelete(){
    this.faceService.deletePersonGroup(this.groupId).subscribe( ()=> {
      this.router.navigate(["groups"]);
    })
  }

}
