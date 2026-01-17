import { Component } from '@angular/core';
import { GameService } from '../game/services/game.service';

import { ButtonModule } from 'primeng/button';
import { GameSettingsComponent } from '../game-settings/game-settings.component';
import { BoardSettings } from '../game/models/boardSettings';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [ButtonModule, GameSettingsComponent],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.scss'
})
export class GameHeaderComponent {
  constructor(public game: GameService) {}

  // Dialog
  visible: boolean = false;

  /**
   * Mostra a Dialog
   */
  showDialog() {
    this.visible = !this.visible;
  }

  /**
   * 
   */
  get formattedSeconds(): string {
    return this.game.timer.toString().padStart(3, '0');
  }

  /**
   * Updates the UI to correspond to the Emoji
   */
  onEmojiClick(): void {
    if (this.game.gameState === 'lost' || this.game.gameState === 'won') {
      this.game.reset();
    }
  }

  /**
   * Recolhe as definições do tabuleiro definidas na modal, e guarda-as no componente.
   * @param settings Definições do tabuleiro
   */
  onBoardSettings(settings: BoardSettings) {
    this.game.currentBoardSettings = settings;
    this.game.start(settings);
    this.game.stopTimer();
  }
}
