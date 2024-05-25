import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Externable } from './externable';

@Component({
  selector: 'app-externable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './externable.component.html',
  styleUrl: './externable.component.scss'
})
export class ExternableComponent extends Externable {

  get outsourced(): boolean {
    return this._externableComponentOwnerService.outsourced;
  }

  constructor() {
    super();
  }

  get currentValue() {
    return this._externableComponentOwnerService.currentValue;
  }

  increase() {
    this._externableComponentOwnerService.increase();
    this.updateOwner();
  }
  
  decrease() {
    this._externableComponentOwnerService.decrease();
    this.updateOwner();
  }

}
