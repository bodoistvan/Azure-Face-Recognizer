import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-you-sure',
  templateUrl: './you-sure.component.html',
  styleUrls: ['./you-sure.component.sass']
})
export class YouSureComponent implements OnInit {

  /**
   * Röviden: A biztosan törölni akarod felugró ablak.
   */

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() text: string = "Are you sure?";

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  //Ha rányomunk a törlésre hívődik az ős, ablak bezárása
  onSubmitClick():void{
    this.onSubmit.emit();
    this.activeModal.close('Close click')
  }

  //Cancel esetén ablak bezárása
  onCancelClick():void{
    this.activeModal.close('Close click')
  }

}