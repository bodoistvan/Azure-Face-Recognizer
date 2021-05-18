import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { asapScheduler, Observable } from 'rxjs';
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

  //A feltöltött fényképre DOM referencia
  @ViewChild('faceImage') faceImage: ElementRef;

  //A kirenderelt téglalapokra DOM ref
  @ViewChildren('faceChooser') faceChooser: FaceChooserComponent[];

  constructor(
    private faceServive: FaceService,
    private toastService: ToastService
    ) { }

  //init kor betöltődnek a már meglévő csoportok amik közül lehet választani a felismeréshez.
  ngOnInit(): void {
    this.groupList$ = this.faceServive.getPersonGroupList();
  }

  //A felismert arcok gyűjteménye
  public responses:FaceResponse[] = [];

  //Az aktuálisan kiválasztott személy kerül bele, (keresés után van egy default, de egyébként kattintásra)
  public selectedResponse:FaceResponse;

  //A választjató csoportok listázásához kell
  public groupList$: Observable<PersonGroup[]>;
  
  //A kiválasztott csoport id-ja
  public selectedGroup:string = "none";

  //A fénykép mint adat, Ennek az src tulajdonásához van bind-olva az oldalon megjelenő fénykép src-je
  public image? = new Image();
  
  //A feltöltött fénykép szélessége, magassága
  public imageDimension?:{w, h};

  //A fényképet körül ölelő div aktuális szélessége, magassága
  public imageCanvasDimension?:{w, h};

  //A betöltött kép torzításának (scale) nagysága
  public ratio:number;

  //A betöltött kép bal felső sarka pontosan melyik pixelre esik, röviden TLC
  public topLeftCorner?:Point;

  //A generálódó téglalapoknak infomáció, a TLC és ratio tulajdonságok leküldése
  public chooserInfo:ChooserInfo;

  //A feltöltött kép, mint objektum
  public fileToUpload: File = null;  

  //A fénykép betallózásakor hívódó fv.
  handleFileInput(files: FileList) {
    if (files.item(0) == undefined){
      //Ha tallózás nem megy végbe, pl. cancel esetén megáll
      return;
    }
    this.fileToUpload = files.item(0);
    this.responses = [];
    const reader = new FileReader();

    //A fénykép betöltődíik és elindul a feltöltés
    reader.onload = e => {
      this.image.src = e.target.result + ""; 
      this.image.onload = ()=> {
        this.imageDimension = { h : this.image.height, w : this.image.width};
        this.onResize();
      }
      //faceDetect - A feltöltött fényképről visszajön a téglalapok helye
      this.faceServive.faceDetect(this.image).subscribe(detected => {
        this.toastService.show("Image uploaded.", { classname:'bg-success', delay: 3000}) 

        if (detected.length == 0){
          this.toastService.show("No face deceted", { classname:'bg-danger', delay: 5000}) 
        } else {
          this.setSelectedResponse(detected[0])
          this.toastService.show(detected.length + " face(s) deceted", { classname:'bg-success', delay: 5000}) 
        }
        //identify - A kiválasztott csoport alapján a visszajött téglalapokhoz neveket rendelünk
        if (this.selectedGroup == "none"){
          this.responses = detected;
          return
        }
        this.toastService.show("identifying...", { delay: 3000})
        const faceIds = detected.map( r => r.faceId);
        this.faceServive.faceIdentify({PersonGroupId: this.selectedGroup, faceIds: faceIds}).subscribe( (identified) =>{

          //searchNames
          this.faceServive.getPersonGroupPersonList(this.selectedGroup).subscribe( personList => {
            //A visszajött adatok alapján a nevek hozzárendelése a téglalapokhoz
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
              //err - personList empty
              this.toastService.show("Group " + this.selectedGroup + " is empty", { classname:'bg-danger', delay: 5000})
              this.responses = detected;
            }) 
        }, err => {
          //err - identify error
          this.toastService.show(err.error.error.message, { classname:'bg-danger', delay: 8000})
          this.responses = detected;
        })
      });

      this.toastService.show("Uploading image...", { delay: 3000})
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  //A ratio és TLC kiszámolása és elmentése
  calculateRatioAndTLC(){
    if (this.imageDimension != undefined && this.imageCanvasDimension != undefined){
      //Alapvetően a scale mértéke mind a két irányban 1
      let ratiow = 1.0;
      let ratioh = 1.0;

      //Ha a fénykép nem illik bele a körülötte lévő div-be, akkor biztosan down-scale-elni fog. 
      //A szélességi és magassági scale mértéke eltérő lehet
      //Pl a körülölelő canvas szélessége nem kisebb mint a fénykép szélessége, de a magassába már gondot okoz
      //emiatt skálázódni fog lefele.
      if (this.imageCanvasDimension.w < this.imageDimension.w){
        ratiow = this.imageCanvasDimension.w / this.imageDimension.w
      } 
      if (this.imageCanvasDimension.h < this.imageDimension.h){
          ratioh = this.imageCanvasDimension.h / this.imageDimension.h
      }

      //Nyilván ha skálázódás történik akkor mind a két irányba megtörténik. 
      //Ezek közül a nagyobb mértékű transzformációt kell kiválasztani.
      // pl. a 0.4 -et választom a 0.8 helyett
      this.ratio = ratioh < ratiow ? ratioh : ratiow;

      //a fent leírtak alapján, mivel a fénykép pözépre van igazítva mind a két tengelyen, kiszámolható a TLC
      let top = (this.imageCanvasDimension.h - this.imageDimension.h * this.ratio) / 2;
      top = top < 0 ? 0 : top;
      let left = (this.imageCanvasDimension.w - this.imageDimension.w * this.ratio) / 2
      left = left < 0 ? 0 :left

      //Ezen adatok elmentése
      this.topLeftCorner = { x : left, y :top};
      this.chooserInfo = {topLeftCorner : this.topLeftCorner, ratio : this.ratio};
    }
  }

  //A generálódó téglalapok (adott indexhez) tartozó aktuális ChooserData.
  //A ChooserData foglalja magába a téglalap poz., méretét, faceId-t, illetve a megjelenő nevet ha van
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

  //A személy kiválasztása
  setSelectedResponse(response:FaceResponse){
    this.selectedResponse = response;
    this.faceChooser.forEach( chooser => chooser.setActive(false));
  }

  //A téglalap által hívott függvény, kikeresi a faceId alapján a személyt, és az lesz a kiválasztott
  setSelectedById(faceId:string){
    const selected = this.responses.find(r => r.faceId == faceId);
    if (selected != undefined){
      this.setSelectedResponse(selected);
    }
  }


  //Az ablak méretezésekor (kicsinyítés, nagyítás) hívódik.
  //Újra kell számolni a TLC-t, majd a téglalapokat újra kell pozíccionálni a TLC alapján.
  onResize(event?) {
    //Canvas méret beállítása, fontos hogy a TLC számolás előtt legyen!!!
    this.setImageCanvasSize(this.faceImage.nativeElement.clientWidth, this.faceImage.nativeElement.clientHeight)
    this.calculateRatioAndTLC();
   
    if (this.faceChooser !=undefined && this.topLeftCorner != undefined && this.ratio != undefined){
      const ci:ChooserInfo = {topLeftCorner : this.topLeftCorner, ratio : this.ratio};
      this.faceChooser.forEach(e => e.refresh(ci));
    }
      
  }

}


