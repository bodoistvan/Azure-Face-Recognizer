import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ChooserData } from 'src/app/models/chooser-data';
import { ChooserInfo } from 'src/app/models/chooser-info';

@Component({
  selector: 'app-face-chooser',
  templateUrl: './face-chooser.component.html',
  styleUrls: ['./face-chooser.component.sass']
})
export class FaceChooserComponent implements OnInit, AfterViewInit {

  @ViewChild('faceChooser') faceChooser : ElementRef;
  @Input() chooserInfo:ChooserInfo = {topLeftCorner: {x: 0,y : 0}, ratio : 1.0};
  @Input() chooserData:ChooserData;
  @Output() activeChooser:EventEmitter<any> = new EventEmitter()

  @Input() active = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.refresh(this.chooserInfo);
  }

  get nameDefined(){
    if (this.chooserData != undefined){
      if (this.chooserData.name != undefined) {
        return true;
      }
    }
    return false;
  }

  refresh(data: ChooserInfo){
    const top = data.topLeftCorner.y + this.chooserData.frame.top * data.ratio
    const left = data.topLeftCorner.x + this.chooserData.frame.left * data.ratio
    const width = this.chooserData.frame.width * data.ratio
    const height = this.chooserData.frame.height * data.ratio

    this.faceChooser.nativeElement.style.top = top + "px";
    this.faceChooser.nativeElement.style.left = left + "px";
    this.faceChooser.nativeElement.style.width = width + "px";
    this.faceChooser.nativeElement.style.height = height + "px";
  }

  onClickActive(){
    this.activeChooser.emit(this.chooserData.faceId);
  }

  setActive(active:boolean){
    this.active = active
  }

}
