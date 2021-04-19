import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FaceResponse } from '../models/face-response';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  constructor(private http: HttpClient) {
   
   }

  recognizeFaces(data: any){
    return this.http.post<FaceResponse[]>( "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&recognitionModel=recognition_01&returnRecognitionModel=true&detectionModel=detection_01&faceIdTimeToLive=86400&returnFaceAttributes=blur,exposure,noise,age,gender,facialhair,glasses,hair,makeup,accessories,occlusion,headpose,emotion,smile", 
    
    data,

    {
       headers:{
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key" : "f134ff913e2b4b98bcca7f1da55b98c6"
       }
    }
    
    )
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
