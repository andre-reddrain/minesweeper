import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss'
})
export class GameOverComponent {
  @Input() result : string = '';
  @Output() rematch = new EventEmitter<void>();

  reset() {
    this.result = '';
    this.rematch.emit();
  }
}
