import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ChooserData } from 'src/app/models/chooser-data';
import { ChooserInfo } from 'src/app/models/chooser-info';

@Component({
  selector: 'app-face-chooser',
  templateUrl: './face-chooser.component.html',
  styleUrls: ['./face-chooser.component.sass']
})
export class FaceChooserComponent implements OnInit, AfterViewInit {

  /*
  Röviden: ez a fényképeken megjelenő téglalap, erre kattintva aktív lesz és annak a személynek az információja jelenik meg.
  */

  //referencia a téglalapra
  @ViewChild('faceChooser') faceChooser : ElementRef;

  //A fénykép bal felső sarkának a pocízciója, valamit a torzítás mértéke
  @Input() chooserInfo:ChooserInfo = {topLeftCorner: {x: 0,y : 0}, ratio : 1.0};

  //A téglalap pocíciója és nagysága, valamint a név adatok vannak benne
  @Input() chooserData:ChooserData;

  //Az ős feliratkozik az eventEmmitterre
  @Output() activeChooser:EventEmitter<any> = new EventEmitter()

  //Ez a téglalap van e kiválasztva, ha igen akkor azt jelezzük valahogy, jelent esetben más a borde színe
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {}

  //A componenst generálása után kell meghívni a pocíccionáló függvényt, mivel ekkor van DOM amit lehet manipulálni.
  ngAfterViewInit(): void {
    this.refresh(this.chooserInfo);
  }

  //A név megjelenítéséhez a feltétel, mivel túl sok helyet foglalt volna a html oldalon, ide lett kiszervezve
  get nameDefined(){
    if (this.chooserData != undefined){
      if (this.chooserData.name != undefined) {
        return true;
      }
    }
    return false;
  }


  //a chooserData információ alapján elhelyezi a téglalapot a megfelelő helyen, ehhez a facechooser referenciát használja
  refresh(data: ChooserInfo){

    //a megfelelő pocíziókat a feltöltött kép aránya szerint kel szorozni
    const top = data.topLeftCorner.y + this.chooserData.frame.top * data.ratio
    const left = data.topLeftCorner.x + this.chooserData.frame.left * data.ratio
    const width = this.chooserData.frame.width * data.ratio
    const height = this.chooserData.frame.height * data.ratio

    //majd a referencia segítségével közvetlenül a DOM stílusát állítani
    this.faceChooser.nativeElement.style.top = top + "px";
    this.faceChooser.nativeElement.style.left = left + "px";
    this.faceChooser.nativeElement.style.width = width + "px";
    this.faceChooser.nativeElement.style.height = height + "px";
  }


  //A téglalap kattintásakor hívódik, Ez visszaadja az őskomponensnek a kattintás tényét, és a faceId.
  //A faceId egyértelműen azonosítja a téglalapot
  onClickActive(){
    this.activeChooser.emit(this.chooserData.faceId);
  }


  setActive(active:boolean){
    this.active = active
  }

}
