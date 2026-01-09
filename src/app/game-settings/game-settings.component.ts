import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'

/**
 * Interface Difficulty.
 */
interface Difficulty {
  name: string;
  col: number;
  row: number;
  mine: number;
}

@Component({
  selector: 'app-game-start',
  standalone: true,
  imports: [ButtonModule, DialogModule, SelectModule, FormsModule, InputNumberModule],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss'
})

export class GameSettingsComponent {
  // Difficulties
  difficulties: Difficulty[] | undefined;
  selectedDifficulty: Difficulty | undefined;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  // Variáveis para controlar a UI
  userInput: boolean = false;

  // Variáveis temporárias para binding
  colValue: number | null = null;
  rowValue: number | null = null;
  mineValue: number | null = null;

  /**
   * Quando é inicializado, vai popular as difficuldades.
   */
  ngOnInit() {
    this.difficulties = [
      { name: "Beginner", col: 9, row: 9, mine: 10 },
      { name: "Intermediate", col: 16, row: 16, mine: 40 },
      { name: "Expert", col: 30, row: 16, mine: 99 },
      { name: "Custom", col: 0, row: 0, mine: 0 },
    ]
  }

  /**
   * Dependente da dificuldade selecionada, vai atualizar as várias variáveis de binding e elementos de UI.
   * @param difficulty Difficuldade selecionada
   */
  onValueChange(difficulty: Difficulty) {
    this.selectedDifficulty = difficulty;

    if (difficulty.name !== 'Custom') {
      this.colValue = difficulty.col;
      this.rowValue = difficulty.row;
      this.mineValue = difficulty.mine;
      this.userInput = false;
    } else {
      this.colValue = null;
      this.rowValue = null;
      this.mineValue = null;
      this.userInput = true;
    }
  }

  /**
   * Boolean composto por 3 outros booleans.
   * Só é true quando os valores das colunas, linhas e minas forem diferentes de null.
   */
  get canStart(): boolean {
    return (
      this.colValue !== null &&
      this.rowValue !== null &&
      this.mineValue !== null
    );
  }

  // Wip
  startGame() {
    console.log("Let the game begin!")

    // Vai começar o jogo
    this.visible = false;
  }

  /**
   * Fecha a Dialog.
   * É corrido cada vez que a p-dialog se esconde (onHide).
   */
  close() {
    // Devolve para o componente-pai a variável como false
    this.visibleChange.emit(false);
  }
}
