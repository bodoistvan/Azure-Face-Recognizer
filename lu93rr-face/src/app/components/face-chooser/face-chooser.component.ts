import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChooserInfo } from 'src/app/models/chooser-info';

@Component({
  selector: 'app-face-chooser',
  templateUrl: './face-chooser.component.html',
  styleUrls: ['./face-chooser.component.sass']
})
export class FaceChooserComponent implements OnInit, AfterViewInit {

  @ViewChild('faceChooser') faceChooser : ElementRef;
  @Input() chooserInfo:ChooserInfo = {topLeftCorner: {x: 0,y : 0}, ratio : 1.0};
  @Input() faceRectangle:any = {
    top: 76,
    left: 446,
    width: 226,
    height: 284
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.chooserInfo)
    console.log(this.faceRectangle);
  }

  ngAfterViewInit(): void {
    this.refresh(this.chooserInfo);
  }

  refresh(data: ChooserInfo){
    const top = data.topLeftCorner.y + this.faceRectangle.top * data.ratio
    const left = data.topLeftCorner.x + this.faceRectangle.left * data.ratio
    const width = this.faceRectangle.width * data.ratio
    const height = this.faceRectangle.height * data.ratio

    this.faceChooser.nativeElement.style.top = top + "px";
    this.faceChooser.nativeElement.style.left = left + "px";
    this.faceChooser.nativeElement.style.width = width + "px";
    this.faceChooser.nativeElement.style.height = height + "px";

    console.log(top, left, width, height);
    console.log(this.chooserInfo, this.faceRectangle);

  }

}
