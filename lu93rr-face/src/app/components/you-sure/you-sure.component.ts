import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-you-sure',
  templateUrl: './you-sure.component.html',
  styleUrls: ['./you-sure.component.sass']
})
export class YouSureComponent implements OnInit {

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() text: string = "Are you sure?";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onSubmitClick():void{
    this.onSubmit.emit();
    this.activeModal.close('Close click')
  }

  onCancelClick():void{
    this.activeModal.close('Close click')
  }

}