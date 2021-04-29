import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCondition } from '../models/api-condition';
import { FaceResponse } from '../models/face-response';
import { PersonGroup } from '../models/person-group';
import { PersonGroupPerson } from '../models/person-group-person';
import { TrainStatus } from '../models/train-status';
import { map, catchError } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { IdentifiedData } from '../models/identified-data';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private subscriptionKey: string;
  private serviceRegion: string;

  constructor(
    private http: HttpClient
  ) {
    this.loadApiCondition();
  }

  isApiConditionsLoaded(){
    return this.isSubscriptionKeyLoaded() && this.isRegionLoaded();
  }

  isSubscriptionKeyLoaded(){
    return this.subscriptionKey != undefined;
  }

  isRegionLoaded(){
    return this.serviceRegion != undefined;
  }

  setApiConditions(condition: ApiCondition){
    this.subscriptionKey = condition.key;
    this.serviceRegion = condition.region;

    this.saveApiConditions();
  }

  saveApiConditions(){
    const condition:ApiCondition = {region : this.serviceRegion, key: this.subscriptionKey};
    localStorage.setItem("condition", JSON.stringify(condition));
  }

  loadApiCondition(){
    const condition = JSON.parse(localStorage.getItem("condition")) as ApiCondition;
    if (condition != undefined){
      this.subscriptionKey = condition.key;
      this.serviceRegion = condition.region;
    }
  }

  //PersonGroup
  getPersonGroupList(){
    return this.http.get<PersonGroup[]>(`${this.serviceRegion}/face/v1.0/persongroups/`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  getPersonGroup(gourpId:string){
    return this.http.get<PersonGroup>(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  getPersonGroupTrainStatus(groupId: string){
    return this.http.get<TrainStatus>(`${this.serviceRegion}/face/v1.0/persongroups/${groupId}/training`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  postPersonGroupTrain(groupId: string){
    return this.http.post(`${this.serviceRegion}/face/v1.0/persongroups/${groupId}/train`,
    {},
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  putPersonGroupCreate(groupName:string):Observable<PersonGroup>{
    const id = groupName.toLowerCase();
    console.log(id);
    return this.http.put<PersonGroup>(`${this.serviceRegion}/face/v1.0/persongroups/${id}`, 
    {
      name : groupName
    },
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    }).pipe(map( (res:any) => {
      const pg:PersonGroup = {name: groupName, personGroupId: id}
      return pg
    }) )
  }

  patchPersonGroup(groupId: string, name:string){
    return this.http.patch(`${this.serviceRegion}/face/v1.0/persongroups/${groupId}`,
    { 
      name 
    },
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  deletePersonGroup(groupId: string){
    console.log("delete");
    return this.http.delete(`${this.serviceRegion}/face/v1.0/persongroups/${groupId}`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });  
  }

  //PersonGroup Person
  getPersonGroupPersonList(gourpId:string){
    return this.http.get<PersonGroupPerson[]>(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  getPersonGroupPerson(gourpId:string, personId:string){
    return this.http.get<PersonGroupPerson>(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons/${personId}`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  postPersonGroupPersonCreate(gourpId:string, name: string){
    return this.http.post<{personId : string}>(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons`,
    {
      name
    },
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  postPersonGroupPersonAddFace(gourpId:string, personId: string, img:any){
    return this.http.post<{persistedFaceId : string}>(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons/${personId}/persistedFaces`,
    
    this.b64toBlob(img.src.split(",")[1]),
    
    {
      headers : {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });
  }

  deletePersonGroupPersonDeleteFace(gourpId:string, personId: string, faceId: string){
    return this.http.delete(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons/${personId}/persistedFaces/${faceId}`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    }); 
  }

  deletePersonGroupPerson(gourpId:string, personId: string){
    return this.http.delete(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons/${personId}`,
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });  
  }

  patchPersonGroupPerson(gourpId:string, personId: string, name:string){
    return this.http.patch(`${this.serviceRegion}/face/v1.0/persongroups/${gourpId}/persons/${personId}`,
    {
      name
    },
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });  
  }

  faceDetect(img: any):Observable<FaceResponse[]>{
    return this.http.post<FaceResponse[]>( `${this.serviceRegion}/face/v1.0/detect`, 
    
    this.b64toBlob(img.src.split(",")[1]),

    {
       headers:{
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
       },
       params: {
        'returnFaceId' : 'true',
        'recognitionModel':'recognition_01',
        'detectionModel':'detection_01',
        'faceIdTimeToLive':'86400',
        'returnFaceAttributes' : "age,gender,glasses,makeup,smile"
       }
    }
    
    )
  }

  faceIdentify(data: {PersonGroupId: string, faceIds: string[]}) {
    return this.http.post<IdentifiedData[]>(`${this.serviceRegion}/face/v1.0/identify`,
    {
      ...data,
      maxNumOfCandidatesReturned: 1,
      confidenceThreshold: 0.5
    },
    {
      headers : {
        "Ocp-Apim-Subscription-Key" : this.subscriptionKey
      }
    });  
  }

  public b64toBlob = (b64DataStr: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64DataStr);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

}
