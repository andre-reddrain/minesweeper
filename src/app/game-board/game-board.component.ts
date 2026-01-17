import { Component } from '@angular/core';
import { GameService } from '../game/services/game.service';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  constructor(public game: GameService) {}

  /**
   * Altera o estado do jogo para corresponder ao icon de jogada.
   * Prevente que esta alteração seja feita pelo Right Click.
   * @param event MouseEvent.
   * @returns Nada, caso o botão pressionado não seja o click esquerdo do rato.
   */
  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;

    if (this.game.board.result === 'ongoing') {
      this.game.gameState = 'pressed';
    }
  }
}
