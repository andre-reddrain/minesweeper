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
    constructor(rows: number = 9, cols: number = 9, mines: number = 10) {
        this.mineCount = mines;

        // Criação das células
        // Rows
        for (let row = 0; row < rows; row++) {
            this.cells[row] = [];

            // Cols
            for (let col = 0; col < cols; col++) {
                this.cells[row][col] = new Cell(row, col);
            }
        }

        // Alocação das minas
        this.placeMines();

        // Calcula o número de minas próximas de cada célula
        this.calculateProximityNumbers()

        // Contagem das células restantes
        this.remainingCells = (rows * cols) - this.mineCount;
    }

    /**
     * Escolhe aleatoriamente uma célula do tabuleiro.
     * Pode escolher células repetidas.
     * @returns Célula
     */
    getRandomCell(): Cell {
        const row = Math.floor(Math.random() * this.cells.length);
        const col = Math.floor(Math.random() * this.cells[row].length);
        return this.cells[row][col]
    }

    /**
     * Coloca as minas de forma eficaz e eficiente.
     */
    placeMines() {
        const allCells = this.cells.flat();

        allCells.sort(() => Math.random() - 0.5)

        // Coloca a quantidade exata de minas
        for (let i = 0; i < this.mineCount; i++) {
            allCells[i].mine = true;
        }
    }

    /**
     * Calcula o número de minas próximas de cada célula.
     */
    calculateProximityNumbers() {
        for (let row = 0; row < this.cells.length; row++) {
            for (let col = 0; col < this.cells[row].length; col++) {
                let adjacentMines = 0;

                // Verificação das casas ao redor (DeltaX, DeltaY)
                for (let [dx, dy] of PROXIMITY) {
                    const r = row + dx;
                    const c = col + dy;
                    if (this.cells[r]?.[c]?.mine) {
                        adjacentMines++
                    }
                }
                this.cells[row][col].proximityMines = adjacentMines;
            }
        }
    }

    /**
     * Verifica o estado da célula clicada.
     * Dependente do estado da célula, termina o jogo ou revela mais células.
     * @param cell Célula a ser verificada
     * @returns Condition se o jogo acabou. Null se não
     */
    checkCell(cell: Cell): string | null {
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
                        this.cells[cell.row + prox[0]] &&
                        this.cells[cell.row + prox[0]][cell.column + prox[1]]
                    ) {
                        this.checkCell(this.cells[cell.row + prox[0]][cell.column + prox[1]])
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
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.mine) {
                    cell.status = 'clear';
                }
            }
        }
    }
}