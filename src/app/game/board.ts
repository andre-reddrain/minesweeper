import { Cell } from './cell'

const PROXIMITY = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

export class Board {
    cells: Cell[][] = []
    remainingCells = 0;
    mineCount = 0;
    result: string | null = 'start';    // start / ongoing / gameover / win

    /**
     * Construtor base do tabuleiro
     * @param rows Linhas do tabuleiro
     * @param cols Colunas do tabuleiro
     * @param mines Minas do tabuleiro
     */
    constructor(rows: number = 9, cols: number = 9, mines: number = 10, timer: number = 999) {
        // Cols
        for (let col = 0; col < cols; col++) {
            this.cells[col] = [];

            // Rows
            for (let row = 0; row < rows; row++) {
                this.cells[col][row] = new Cell(col, row);
            }
        }

        // Alocação das minas
        for (let i = 0; i < mines; i++) {
            this.getRandomCell().mine = true;
        }

        // Contagem das minas
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                let adjacentMines = 0;

                // 
                for (let prox of PROXIMITY) {
                    if (
                        this.cells[col + prox[0]] &&
                        this.cells[col + prox[0]][row + prox[1]] &&
                        this.cells[col + prox[0]][row + prox[1]].mine
                    ) {
                        adjacentMines++
                    }
                }
                this.cells[col][row].proximityMines = adjacentMines;

                // Incremento do nº de minas
                if (this.cells[col][row].mine) {
                    this.mineCount++;
                }
            }
        }
        this.remainingCells = (cols * rows) - this.mineCount;
    }

    /**
     * Escolhe aleatoriamente uma célula do tabuleiro.
     * Pode escolher células repetidas.
     * @returns Célula
     */
    getRandomCell(): Cell {
        const col = Math.floor(Math.random() * this.cells.length);
        const row = Math.floor(Math.random() * this.cells[col].length);
        return this.cells[col][row]
    }

    /**
     * Verifica o estado da célula clicada.
     * Dependente do estado da célula, termina o jogo ou revela mais células.
     * @param cell Célula a ser verificada
     * @returns Condition se o jogo acabou. Null se não
     */
    checkCell(cell: Cell): string | null {
        // console.log(cell);
        let condition = '';

        // Verificação do status da célula
        if (cell.status !== "open") {
            return this.result;
        } else if (cell.mine) {
            // A célula é uma mina. Game over!
            condition = 'gameover';
        } else {
            cell.status = "clear";

            // Se a célula não tem minas na sua proximidade, vai, recursivamente, mostrar as células ao seu redor.
            if(cell.proximityMines === 0) {
                for (let prox of PROXIMITY) {
                    if (
                        this.cells[cell.column + prox[0]] &&
                        this.cells[cell.column + prox[0]][cell.row + prox[1]]
                    ) {
                        this.checkCell(this.cells[cell.column + prox[0]][cell.row + prox[1]])
                    }
                }
            }

            // Condição de vitória
            if(this.remainingCells-- <= 1) {
                condition = 'win';
            }
        }

        // Vai revelar tudo se o jogo já tiver acabado
        if (condition !== '') {
            this.revealAll();
            return condition;
        }

        return this.result;
    }

    /**
     * Revela todas as casas ainda por jogar.
     */
    revealAll() {
        for (const col of this.cells) {
            for (const cell of col) {
                // if (cell.status === 'open') {
                //     cell.status = 'clear';
                // }
                if (cell.mine) {
                    cell.status = 'clear';
                }
            }
        }
    }
}