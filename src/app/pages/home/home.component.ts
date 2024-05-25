import { Component, inject, NgZone } from '@angular/core';
import { ExternableComponent } from '../externable/externable.component';
import { ExternableComponentOwnerService } from '../../../services/externable-component-owner.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

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
}
