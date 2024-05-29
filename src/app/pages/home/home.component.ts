import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ExternableComponentOwnerService } from '../../../services/externable-component-owner.service';
import { ExternableComponent } from '../externable/externable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ExternableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private _externableComponentOwnerService: ExternableComponentOwnerService = inject(ExternableComponentOwnerService);

  get outsourced(): boolean {
    return this._externableComponentOwnerService.outsourced;
  }

  get currentValue(): number {
    return this._externableComponentOwnerService.currentValue;
  }

  close() {
    this._externableComponentOwnerService.closeWindow();
  }

  increase() {
    this._externableComponentOwnerService.increase();
  }

  decrease() {
    this._externableComponentOwnerService.decrease();
  }
}
