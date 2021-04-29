import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ChooserInfo } from 'src/app/models/chooser-info';
import { FaceResponse } from 'src/app/models/face-response';
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
    //this.faceServive.recognizeFaces().subscribe(data => this.response = data, err=>console.error(err));
    
    
  }



  public responses:FaceResponse[] = [];

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
      
      const data = this.faceServive.b64toBlob(this.image.src.replace("data:image/jpeg;base64,", ""));
      this.faceServive.recognizeFaces(data).subscribe(data => {
        this.responses = data;
        this.toastService.show("Image uploaded.", { classname:'bg-success', delay: 3000})
      }, err=>{
        console.error(err); console.error(err)
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

  setImageCanvasSize( w:number,h:number){
    this.imageCanvasDimension = { w, h };
  }

  getfaceRectangle(index : number){
    if (this.responses.length != 0){
      return this.responses[index].faceRectangle;
    }
  }

  onResize(event?) {
    this.setImageCanvasSize(this.faceImage.nativeElement.clientWidth, this.faceImage.nativeElement.clientHeight)
    this.calculateRatioAndTLC();
    
    if(this.topLeftCorner != undefined){
      console.log("tl: " + this.topLeftCorner.x + " " + this.topLeftCorner.y);
      console.log("ratio: " + this.ratio);
    }
   
    if (this.faceChooser !=undefined && this.topLeftCorner != undefined && this.ratio != undefined){
      const ci:ChooserInfo = {topLeftCorner : this.topLeftCorner, ratio : this.ratio};
      this.faceChooser.forEach(e => e.refresh(ci));
    }
      
  }

}
