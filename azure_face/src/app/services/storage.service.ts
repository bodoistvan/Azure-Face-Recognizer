import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FaceImageInfo } from '../models/face-image-info';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Röviden: A feltöltéskor a fénykép nem marad meg a szerveren, A feltöltött kép Id-ja és 
   * a feltöltött kép neve összerendelődik és eltárolódik ebben az adatbázisban
   */

  faces: FaceImageInfo[] = []

  constructor() {
    this.loadDatabase()
   }

  loadDatabase(){
    this.loadFaces()
  }

  saveDatabase(){
    this.saveFaces()
  }

  loadFaces(){
    const faces = JSON.parse(localStorage.getItem("faces")) as FaceImageInfo[];

    if (faces != undefined){
      this.faces = faces;
    }
  }

  saveFaces(){
    if ( this.faces.length > 0 ){
      const data = JSON.stringify(this.faces);
      localStorage.setItem("faces", data);
    }
  }

  addFace(info:FaceImageInfo){
    this.faces.push(info);
    this.saveFaces();
  }

  /**
   * 
   * @param faceIds Az fényképek Id-jának a listája
   * @returns Egy olyan listát amiben már össze van rendelve a névvel, ha benne volt az adatbázisban
   */

  getFacesById( faceIds : string[] ){

    const data:FaceImageInfo[] = faceIds.map( faceId => {
     
      const faceDb = this.faces.find( face => face.persistedFaceId == faceId);
      if (faceDb != undefined){
        return faceDb;
      }

      return ({persistedFaceId : faceId})

    });

    return of(data);

  }






}
