import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { ChooserData } from 'src/app/models/chooser-data';
import { ChooserInfo } from 'src/app/models/chooser-info';
import { FaceResponse } from 'src/app/models/face-response';
import { PersonGroup } from 'src/app/models/person-group';
import { Point } from 'src/app/models/point';
import { FaceService } from 'src/app/services/face.service';
import { ToastService } from 'src/app/services/toast.service';
import { FaceChooserComponent } from '../face-chooser/face-chooser.component';

@Component({
  selector: 'app-face-info',
  templateUrl: './face-info.component.html',
  styleUrls: ['./face-info.component.sass']
})
export class FaceInfoComponent implements OnInit{

  @ViewChild('faceImage') faceImage: ElementRef;
  @ViewChildren('faceChooser') faceChooser: FaceChooserComponent[];

  constructor(
    private faceServive: FaceService,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    this.groupList$ = this.faceServive.getPersonGroupList();
  }

  public responses:FaceResponse[] = [];
  public selectedResponse:FaceResponse;
  public groupList$: Observable<PersonGroup[]>;
  
  public selectedGroup:string = "none";

  public image? = new Image();
  
  public imageDimension?:{w, h};
  public imageCanvasDimension?:{w, h};
  public ratio:number;
  public topLeftCorner?:Point;

  public chooserInfo:ChooserInfo;

  public fileToUpload: File = null;  

  handleFileInput(files: FileList) {

    this.fileToUpload = files.item(0);
    this.responses = [];
    const reader = new FileReader();
    reader.onload = e => {
      this.image.src = e.target.result + ""; 
      this.image.onload = ()=> {
        this.imageDimension = { h : this.image.height, w : this.image.width};
        this.onResize();
      }
      //faceDetect
      this.faceServive.faceDetect(this.image).subscribe(detected => {
        this.toastService.show("Image uploaded.", { classname:'bg-success', delay: 3000}) 

        if (detected.length == 0){
          this.toastService.show("No face deceted", { classname:'bg-danger', delay: 5000}) 
        } else {
          this.setSelectedResponse(detected[0])
          this.toastService.show(detected.length + " face(s) deceted", { classname:'bg-success', delay: 5000}) 
        }
        //identify
        if (this.selectedGroup == "none"){
          this.responses = detected;
          return
        }
        this.toastService.show("identifying...", { delay: 3000})
        const faceIds = detected.map( r => r.faceId);
        this.faceServive.faceIdentify({PersonGroupId: this.selectedGroup, faceIds: faceIds}).subscribe( (identified) =>{

          //searchNames
          this.faceServive.getPersonGroupPersonList(this.selectedGroup).subscribe( personList => {

            let count = 0;
            identified.forEach( i => {
              if ( i.candidates.length > 0 ){
                  const person = detected.find( d => d.faceId == i.faceId);
                  const personId = i.candidates[0].personId;
                  const personName = personList.find( p => p.personId == personId)?.name;
                  if (personName != undefined){
                    count++;
                    person.name = personName;
                    this.toastService.show(personName + " identified", { classname:'bg-success', delay: 3000})
                  }
                  
                  
              }
            })
            if ( count == 0){
              this.toastService.show("No person identified", { classname:'bg-danger', delay: 5000})
            } 
            
            this.responses = detected;
          }, () => {
              //personList empty
              this.toastService.show("Group " + this.selectedGroup + " is empty", { classname:'bg-danger', delay: 5000})
            
          }) 
        }, err => {
          //identify error
          this.toastService.show(err.error.error.message, { classname:'bg-danger', delay: 8000})

        })
        
      });

      this.toastService.show("Uploading image...", { delay: 3000})
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  calculateRatioAndTLC(){
    if (this.imageDimension != undefined && this.imageCanvasDimension != undefined){
      let ratiow = 1.0;
      let ratioh = 1.0;

      if (this.imageCanvasDimension.w < this.imageDimension.w){
        ratiow = this.imageCanvasDimension.w / this.imageDimension.w
      } 
      if (this.imageCanvasDimension.h < this.imageDimension.h){
          ratioh = this.imageCanvasDimension.h / this.imageDimension.h
      }
      this.ratio = ratioh < ratiow ? ratioh : ratiow;

      let top = (this.imageCanvasDimension.h - this.imageDimension.h * this.ratio) / 2;
      top = top < 0 ? 0 : top;
      let left = (this.imageCanvasDimension.w - this.imageDimension.w * this.ratio) / 2
      left = left < 0 ? 0 :left

      this.topLeftCorner = { x : left, y :top};
      this.chooserInfo = {topLeftCorner : this.topLeftCorner, ratio : this.ratio};
    }
  }

  getChooserData(index: number):ChooserData{

    const res = this.responses[index];
    if (res != undefined){
      const chooserData:ChooserData = 
      {
        frame : {
          top: res.faceRectangle.top,
          height: res.faceRectangle.height,
          left: res.faceRectangle.left,
          width: res.faceRectangle.width
        },
        faceId : res.faceId,
        name: res.name
      }
      return chooserData;
    }

  }

  setImageCanvasSize( w:number,h:number){
    this.imageCanvasDimension = { w, h };
  }

  getfaceRectangle(index : number){
    if (this.responses.length != 0){
      return this.responses[index].faceRectangle;
    }
  }

  setSelectedResponse(response:FaceResponse){
    this.selectedResponse = response;
    this.faceChooser.forEach( chooser => chooser.setActive(false));
  }

  setSelectedById(faceId:string){

    const selected = this.responses.find(r => r.faceId == faceId);
    if (selected != undefined){
      this.setSelectedResponse(selected);
    }

  }

  onResize(event?) {
    this.setImageCanvasSize(this.faceImage.nativeElement.clientWidth, this.faceImage.nativeElement.clientHeight)
    this.calculateRatioAndTLC();
   
    if (this.faceChooser !=undefined && this.topLeftCorner != undefined && this.ratio != undefined){
      const ci:ChooserInfo = {topLeftCorner : this.topLeftCorner, ratio : this.ratio};
      this.faceChooser.forEach(e => e.refresh(ci));
    }
      
  }

}
