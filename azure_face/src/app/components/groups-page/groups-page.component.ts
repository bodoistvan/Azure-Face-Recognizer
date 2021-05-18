import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonGroup } from 'src/app/models/person-group';
import { FaceService } from 'src/app/services/face.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.sass']
})
export class GroupsPageComponent implements OnInit {

  /*
  Röviden: A csoporokat listázó oldal
  */

  constructor(
    private faceService:FaceService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.faceService.getPersonGroupList().subscribe( (data) => this.personGroups = this.sortByName(data));
  }

  personGroups:PersonGroup[] = [];

  newGroupForm = this.fb.control([], Validators.required);

  //Új csoport létrehozásakor API hívás, illetve bekerül a jelenlegi betöltött listába is a kérés
  onNewGroupSubmit(){
    this.newGroupForm.markAsTouched();

    if (this.newGroupForm.valid == true){
      const name = this.newGroupForm.value;
      this.faceService.putPersonGroupCreate(name).subscribe((res) => {
        const person:PersonGroup = {name: res.name, personGroupId : res.personGroupId};  
        this.personGroups.push(person);
        this.personGroups = this.sortByName(this.personGroups);
        this.newGroupForm.reset();
        this.newGroupForm.markAsUntouched();
      });
    }
  }
  
  sortByName(array:PersonGroup[]){
    return array.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))
  }

}
