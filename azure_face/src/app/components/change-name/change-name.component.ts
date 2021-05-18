import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.sass']
})
export class ChangeNameComponent implements OnInit {

  /*
  Röviden: A név változtatásokért felelős komponens. Felugró ablak, amiben egy form található.
  Submittal visszahívja az őskomponens függvényét.
  */


  //A submit hatására Eventemitter
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  //A név változtatás előtti név ami szerkesztésre kerül
  @Input() prevName: string;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
    ) { }

  //init kor beállítódik a formon a beküldött név.
  ngOnInit(): void {
    this.newName.patchValue(this.prevName);
  }

  //Reactive formhoz tartozó FormControl
  newName = this.fb.control([""], Validators.required);


  //A submit gomb kattintása. Meghívja az őst, illetve bezárja az ablakot.
  onSubmitClick():void{
    this.onSubmit.emit(this.newName.value);
    this.activeModal.close('Close click')
  }


  //A mégse gomb kattintása. Bezárja az ablakot.
  onCancelClick():void{
    this.activeModal.close('Close click')
  }

}
