import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.sass']
})
export class ChangeNameComponent implements OnInit {

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() prevName: string;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    console.log(this.prevName);
    this.newName.patchValue(this.prevName);
  }

  newName = this.fb.control([""], Validators.required);

  onSubmitClick():void{
    this.onSubmit.emit(this.newName.value);
    this.activeModal.close('Close click')
  }

  onCancelClick():void{
    this.activeModal.close('Close click')
  }

}
