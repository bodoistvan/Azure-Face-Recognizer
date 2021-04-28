import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiCondition } from 'src/app/models/api-condition';
import { FaceService } from 'src/app/services/face.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.sass']
})
export class SettingPageComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    private faceService: FaceService
  ) { }

  ngOnInit(): void {
  }

  public settingsForm = this.fb.group({
    region: ["", Validators.required],
    key: ["", Validators.required]
  });

  get region(){
    return this.settingsForm.get("region") as FormControl;
  }

  get key(){
    return this.settingsForm.get("key") as FormControl;
  }


  onSubmitClick(){

    this.key.markAsTouched()
    this.region.markAsTouched();

    if (this.settingsForm.valid == true){
      
      const formValue = this.settingsForm.value;

      const condition:ApiCondition = {region : formValue.region, key: formValue.key};
      this.faceService.setApiConditions(condition);
      
    }

  }

}
