import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FaceImageInfo } from 'src/app/models/face-image-info';
import { PersonGroupPerson } from 'src/app/models/person-group-person';
import { FaceService } from 'src/app/services/face.service';
import { StorageService } from 'src/app/services/storage.service';
import { textChangeRangeIsUnchanged } from 'typescript';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { YouSureComponent } from '../you-sure/you-sure.component';

@Component({
  selector: 'app-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.sass']
})
export class PersonPageComponent implements OnInit, AfterViewInit {
  
  /**
   * 
   * Röviden: Az adott felhasználó adatait megjelenítő oldal
   * a felhasználó a groupId és personId alapján van meghatározva
   * 
   */

  @ViewChild('uploadButton') uploadButton:ElementRef; 

  constructor(
    private faceService: FaceService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router:Router
  ) { }

  ngAfterViewInit(): void {
    this.uploadButton.nativeElement.disabled = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.groupId = params["groupId"];
      this.personId = params["personId"];
      this.faceService.getPersonGroupPerson(this.groupId, this.personId).subscribe(person => {
        this.person = person;

        this.storageService.getFacesById(this.person.persistedFaceIds).subscribe( faces => {
          this.imagesToShow = faces;
        } )

      });
    })
  }

  
  personId :string;
  groupId: string;

  person: PersonGroupPerson;
  imagesToShow: FaceImageInfo[] = [];

  public image? = new Image();
  public fileToUpload: File = null; 


  //egy fénykép feltöltése, analóg módon van megvalósítva a face-info függvényével
  handleFileInput(files: FileList) {
    if (files.item(0) == undefined){
      return;
    }
    this.fileToUpload = files.item(0);
    const reader = new FileReader();
    reader.onload = e => {
      this.image.src = e.target.result + ""; 
      this.uploadButton.nativeElement.disabled = false;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  
  
  
  /**
   * A fénykép feltöltése gombra kattintva API híváson keresztül elmegy a kép. A visszajövő id illetve a feltöltött kép neve
   *  bekerül a Storage service tárolójába.
   */

  onUpload(){
    if (this.image.src == ""){
      return
    }
    
    this.uploadButton.nativeElement.disabled = true;

    this.faceService.postPersonGroupPersonAddFace(this.groupId, this.personId, this.image).subscribe((res)=>
    {
      
      this.person.persistedFaceIds.push(res.persistedFaceId)
      
      const imageInfo:FaceImageInfo = { persistedFaceId : res.persistedFaceId, location: this.fileToUpload.name}
      this.storageService.addFace(imageInfo);
      this.imagesToShow.push(imageInfo);

      this.fileToUpload = undefined;
      this.image.src = '';
      this.uploadButton.nativeElement.disabled = false;
    }
    );
  }

  onChangeName(){
    const modalRef = this.modalService.open(ChangeNameComponent, {centered: true});
    modalRef.componentInstance.prevName = this.person.name;
    modalRef.componentInstance.onSubmit.subscribe((name) => this.changeName(name));
  }

  changeName(name:string){
    this.faceService.patchPersonGroupPerson(this.groupId, this.personId, name).subscribe(()=>{
      this.person.name = name;
    });
  }

  onFaceDelete(faceId: string){
    const modalRef = this.modalService.open(YouSureComponent, {centered: true});
    modalRef.componentInstance.text = "Are you sure you want to delete face: " + faceId;
    modalRef.componentInstance.onSubmit.subscribe(() => this.faceDelete(faceId));
  }

  faceDelete(faceId:string){
    this.faceService.deletePersonGroupPersonDeleteFace(this.groupId, this.personId, faceId).subscribe(() => {
      const index = this.person.persistedFaceIds.indexOf(faceId);
      if (index != -1) {
        this.person.persistedFaceIds.splice(index, 1);
      }
      const imgInfo = this.imagesToShow.find(f => f.persistedFaceId == faceId);

      if (imgInfo != undefined) {
        const imgIndex = this.imagesToShow.indexOf(imgInfo);

        if (imgIndex != -1) {
          this.imagesToShow.splice(imgIndex, 1);
        }
      }

    });
  }

  onPersonDelete(){
    const modalRef = this.modalService.open(YouSureComponent, {centered: true});
    modalRef.componentInstance.text = "Are you sure you want to delete person: " + this.person.name;
    modalRef.componentInstance.onSubmit.subscribe(() => this.personDelete());
  }

  personDelete(){
    this.faceService.deletePersonGroupPerson(this.groupId, this.personId).subscribe(
      () => {
        this.router.navigate(["groups", this.groupId]);
      }
    )
  }

}
