import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss'
})

export class GameStartComponent {
  @Input() result : string = '';
  @Output() rematch = new EventEmitter<void>();

  @Output() difficulty : string = '';

  reset() {
    this.result = '';
    this.rematch.emit();
  }
}
